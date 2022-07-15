import { useCallback, useEffect, useMemo } from "react";
import { reaction, transaction } from "mobx";

import { useLocalStore } from "./useLocalStore";
import { useEventListener } from "./useEventListener";
import { useResizeObserver } from "./useResizeObserver";
import { debounce as debounceHof } from "@core/utils/common.utils";
import { calculateCoord, calculateScale } from "@core/utils/math.utils";

export interface Options {
	debounce?: number;
	resizeType?: "scale" | "rect";
}

export function useTransformDifference({ debounce = 100, resizeType = "scale" }: Options = {}) {
	const startResizeObserver = useResizeObserver({ debounce });
	const endResizeObserver = useResizeObserver({ debounce });

	const localStore = useLocalStore({
		scale: { x: 1, y: 1 },
		position: { x: 0, y: 0 },
		ready: false,
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

		transaction(() => {
			localStore.setScale({ ...scale });
			localStore.setPosition({ ...position });
			localStore.setReady(startResizeObserver.ready() && endResizeObserver.ready());
		});
	}, [startResizeObserver, endResizeObserver, resizeType, localStore]);

	const preparedCalculate = useMemo(
		() => (debounce ? debounceHof(calculate, debounce) : calculate),
		[debounce, calculate]
	);

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

	const ready = useCallback(() => {
		return localStore.ready;
	}, [localStore]);

	useEffect(
		() =>
			reaction(
				() => [startResizeObserver.getSize(), endResizeObserver.getSize()],
				() => calculate()
			),
		[calculate, endResizeObserver, startResizeObserver]
	);

	useEventListener(window, "resize", preparedCalculate);

	return {
		startRef: startResizeObserver.ref,
		endRef: endResizeObserver.ref,
		startResizeObserver,
		endResizeObserver,
		getStartOffset,
		getEndOffset,
		getDifference,
		getPosition,
		ready,
		getScale,
		calculate,
	};
}
