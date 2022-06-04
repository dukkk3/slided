import { useCallback, useEffect } from "react";

import { useResizeObserver, useLocalStore, useThrottle } from "@core/hooks";
import { calculateCoord, calculateScale, calculateElementOffset } from "@core/utils";
import { reaction, transaction } from "mobx";

interface Options {
	debug?: boolean;
	calculationPreset?: "scale" | "rect";
}

export function useTransformDifference({ debug, calculationPreset = "scale" }: Options = {}) {
	const startResizeObserver = useResizeObserver();
	const endResizeObserver = useResizeObserver();

	const localStore = useLocalStore({ scale: { x: 1, y: 1 }, position: { x: 0, y: 0 } });

	const calculate = useThrottle(
		() => {
			const scale = { x: 1, y: 1 };
			const position = { x: 0, y: 0 };

			const startSize = startResizeObserver.getSize();
			const endSize = endResizeObserver.getSize();

			const startOffset = calculateElementOffset(startResizeObserver.ref.current);
			const endOffset = calculateElementOffset(endResizeObserver.ref.current);

			position.x =
				calculationPreset === "scale"
					? calculateCoord(startOffset.left, endOffset.left, startSize.width, endSize.width)
					: endOffset.left - startOffset.left;
			position.y =
				calculationPreset === "scale"
					? calculateCoord(startOffset.top, endOffset.top, startSize.height, endSize.height)
					: endOffset.top - startOffset.top;

			scale.x = calculateScale(endSize.width, startSize.width);
			scale.y = calculateScale(endSize.height, startSize.height);

			if (debug) {
				console.log({
					startOffset,
					endOffset,
					endSize: { ...endSize },
					startSize: { ...startSize },
					position,
					scale,
				});
			}

			transaction(() => {
				localStore.setScale({ ...scale });
				localStore.setPosition({ ...position });
			});
		},
		200,
		[localStore, startResizeObserver, endResizeObserver]
	);

	const getScale = useCallback(() => {
		return localStore.scale;
	}, [localStore]);

	const getPosition = useCallback(() => {
		return localStore.position;
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
		getDifference,
		getPosition,
		getScale,
		calculate,
	};
}
