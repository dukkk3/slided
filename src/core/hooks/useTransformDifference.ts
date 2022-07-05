import { useCallback, useEffect } from "react";
import { reaction, transaction } from "mobx";

import { useResizeObserver } from "./useResizeObserver";
import { useLocalStore } from "./useLocalStore";
import { calculateCoord, calculateScale } from "@core/utils/math.utils";

export declare namespace useTransformDifference {
	interface Options {
		resizeType?: "scale" | "rect";
		logging?: boolean;
	}
}

export function useTransformDifference({
	logging,
	resizeType = "scale",
}: useTransformDifference.Options = {}) {
	const startResizeObserver = useResizeObserver({ debounce: 100 });
	const endResizeObserver = useResizeObserver({ debounce: 100 });

	const localStore = useLocalStore({
		scale: { x: 1, y: 1 },
		position: { x: 0, y: 0 },
	});

	const calculate = useCallback(() => {
		const scale = { x: 1, y: 1 };
		const position = { x: 0, y: 0 };

		const startSize = startResizeObserver.getSize();
		const endSize = endResizeObserver.getSize();

		const startOffset = startResizeObserver.getOffset();
		const endOffset = endResizeObserver.getOffset();

		position.x =
			resizeType === "scale"
				? calculateCoord(startOffset.left, endOffset.left, startSize.width, endSize.width)
				: endOffset.left - startOffset.left;
		position.y =
			resizeType === "scale"
				? calculateCoord(startOffset.top, endOffset.top, startSize.height, endSize.height)
				: endOffset.top - startOffset.top;

		scale.x = calculateScale(endSize.width, startSize.width);
		scale.y = calculateScale(endSize.height, startSize.height);

		if (logging) {
			console.log({
				position,
				scale,
				startSize: { ...startSize },
				endSize: { ...endSize },
				startOffset,
				endOffset,
			});
		}

		transaction(() => {
			localStore.setScale({ ...scale });
			localStore.setPosition({ ...position });
		});
	}, [startResizeObserver, endResizeObserver, resizeType, logging, localStore]);

	const getScale = useCallback(() => {
		return localStore.scale;
	}, [localStore]);

	const getPosition = useCallback(() => {
		return localStore.position;
	}, [localStore]);

	const getStartOffset = useCallback(() => {
		return startResizeObserver.getOffset();
	}, [startResizeObserver]);

	const getEndOffset = useCallback(() => {
		return endResizeObserver.getOffset();
	}, [endResizeObserver]);

	const getDifference = useCallback(() => {
		return {
			scale: getScale(),
			position: getPosition(),
		};
	}, [getScale, getPosition]);

	useEffect(
		() =>
			reaction(
				() => [startResizeObserver.getSize(), endResizeObserver.getSize()],
				() => calculate()
			),
		[calculate, endResizeObserver, startResizeObserver]
	);

	useEffect(() => {
		window.addEventListener("resize", calculate);

		return () => {
			window.removeEventListener("resize", calculate);
		};
	}, [calculate]);

	return {
		startRef: startResizeObserver.ref,
		endRef: endResizeObserver.ref,
		startResizeObserver,
		endResizeObserver,
		getStartOffset,
		getEndOffset,
		getDifference,
		getPosition,
		getScale,
		calculate,
	};
}
