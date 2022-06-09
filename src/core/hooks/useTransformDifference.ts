import React, { useCallback, useEffect } from "react";

import { useResizeObserver, useLocalStore, useThrottle } from "@core/hooks";
import { calculateCoord, calculateScale, calculateElementOffset } from "@core/utils";
import { reaction, transaction } from "mobx";

interface Options {
	endRef?: React.RefObject<any>;
	startRef?: React.RefObject<any>;
	resizeType?: "scale" | "rect";
	logging?: boolean;
}

export function useTransformDifference({
	startRef,
	endRef,
	logging,
	resizeType = "scale",
}: Options = {}) {
	const startResizeObserver = useResizeObserver({ ref: startRef });
	const endResizeObserver = useResizeObserver({ ref: endRef });

	const localStore = useLocalStore({
		scale: { x: 1, y: 1 },
		position: { x: 0, y: 0 },
		startOffset: { top: 0, left: 0 },
		endOffset: { top: 0, left: 0 },
	});

	const calculate = useThrottle(
		() => {
			const scale = { x: 1, y: 1 };
			const position = { x: 0, y: 0 };

			const startSize = startResizeObserver.getSize();
			const endSize = endResizeObserver.getSize();

			const startOffset = calculateElementOffset(startResizeObserver.ref.current);
			const endOffset = calculateElementOffset(endResizeObserver.ref.current);

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
				console.log({ position, scale, startSize: { ...startSize }, endSize: { ...endSize } });
			}

			transaction(() => {
				localStore.setScale({ ...scale });
				localStore.setPosition({ ...position });
				localStore.setStartOffset(startOffset);
				localStore.setEndOffset(endOffset);
			});
		},
		200,
		[localStore, startResizeObserver, endResizeObserver, logging]
	);

	const getScale = useCallback(() => {
		return localStore.scale;
	}, [localStore]);

	const getPosition = useCallback(() => {
		return localStore.position;
	}, [localStore]);

	const getStartOffset = useCallback(() => {
		return localStore.startOffset;
	}, [localStore]);

	const getEndOffset = useCallback(() => {
		return localStore.endOffset;
	}, [localStore]);

	const getDifference = useCallback(() => {
		return {
			scale: getScale(),
			position: getPosition(),
		};
	}, [getScale, getPosition]);

	useEffect(
		() =>
			reaction(
				() => [
					startResizeObserver.getSize(),
					endResizeObserver.getSize(),
					startResizeObserver.getPosition(),
					endResizeObserver.getPosition(),
				],
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
