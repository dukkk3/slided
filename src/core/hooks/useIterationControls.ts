import { useCallback, useMemo } from "react";
import { easings } from "react-spring";

import { useIterationsContext } from "@core/hooks";
import { clamp } from "@core/utils";
import { useLocalStore } from "./useLocalStore";

interface Options {
	offsetAroundCenter?: number;
	normalizeDuration?: boolean;
	startOffset?: number;
	endOffset?: number;
}

export function useIterationControls(
	iteration: number,
	{ normalizeDuration, startOffset = 0.5, endOffset = 0.5, offsetAroundCenter = 0 }: Options = {}
) {
	const iterationsContext = useIterationsContext();
	const center = useMemo(
		() => ({ fromStart: iteration - offsetAroundCenter, toEnd: iteration + offsetAroundCenter }),
		[iteration, offsetAroundCenter]
	);
	const start = useMemo(
		() => clamp(iteration - startOffset, 0, iterationsContext.iterations),
		[iteration, iterationsContext, startOffset]
	);
	const end = useMemo(
		() => clamp(iteration + endOffset, 0, iterationsContext.iterations + endOffset),
		[endOffset, iteration, iterationsContext]
	);

	const toCenterDurationFactor = useMemo(() => {
		return iterationsContext.getDurationFactorOnRange(start, center.fromStart);
	}, [start, center, iterationsContext]);

	const fromCenterDurationFactor = useMemo(() => {
		return iterationsContext.getDurationFactorOnRange(center.toEnd, end);
	}, [end, center, iterationsContext]);

	const preparedCenter = useMemo<typeof center>(
		() => ({
			fromStart:
				start +
				Math.abs(center.fromStart - start) * (normalizeDuration ? 1 / toCenterDurationFactor : 1),
			toEnd:
				end - Math.abs(center.toEnd - end) * (normalizeDuration ? 1 / fromCenterDurationFactor : 1),
		}),
		[start, center, normalizeDuration, toCenterDurationFactor, end, fromCenterDurationFactor]
	);

	const localStore = useLocalStore({
		get started() {
			return iterationsContext.store.compare(start, "lte");
		},
		get ended() {
			return iterationsContext.store.compare(end, "lte");
		},
		get opened() {
			return iterationsContext.store.compare(preparedCenter.fromStart, "lte");
		},
		get startClosed() {
			return iterationsContext.store.compare(preparedCenter.toEnd, "lte");
		},
		get closed() {
			return this.startClosed && this.ended;
		},
		get currentType() {
			return this.visibleOpening ? "opening" : "closing";
		},
		get visibleOpening() {
			return iterationsContext.store.inRange(start, preparedCenter.fromStart);
		},
		get visibleClosing() {
			return iterationsContext.store.inRange(preparedCenter.toEnd, end);
		},
		get visible() {
			return iterationsContext.store.inRange(start, end);
		},
	});

	const visible = useCallback(
		(type?: "opening" | "closing") => {
			switch (type) {
				case "opening":
					return localStore.visibleOpening;
				case "closing":
					return localStore.visibleClosing;
				default:
					return localStore.visible;
			}
		},
		[localStore]
	);

	const started = useCallback(() => {
		return localStore.started;
	}, [localStore]);

	const ended = useCallback(() => {
		return localStore.ended;
	}, [localStore]);

	const opened = useCallback(() => {
		return localStore.opened;
	}, [localStore]);

	const startClosed = useCallback(() => {
		return localStore.startClosed;
	}, [localStore]);

	const closed = useCallback(() => {
		return localStore.closed;
	}, [localStore]);

	const currentType = useCallback(() => {
		return localStore.currentType;
	}, [localStore]);

	const interpolations = useMemo(
		() => ({
			opening: iterationsContext.animated.toRange(start, preparedCenter.fromStart),
			closing: iterationsContext.animated.toRange(preparedCenter.toEnd, end),
		}),
		[preparedCenter.fromStart, preparedCenter.toEnd, end, iterationsContext, start]
	);

	const toEasing = useCallback(
		(easing: keyof typeof easings) => ({
			opening: interpolations.opening.to<number>({
				range: [0, 1],
				output: [0, 1],
				easing: easings[easing],
			}),
			closing: interpolations.closing.to<number>({
				range: [0, 1],
				output: [0, 1],
				easing: easings[easing],
			}),
		}),
		[interpolations]
	);

	const ranges = useMemo(
		() => ({
			opening: () => iterationsContext.store.toRange(start, preparedCenter.fromStart),
			closing: () => iterationsContext.store.toRange(preparedCenter.toEnd, end),
		}),
		[preparedCenter.fromStart, preparedCenter.toEnd, end, iterationsContext, start]
	);

	return {
		end,
		start,
		started,
		ended,
		opened,
		closed,
		ranges,
		visible,
		iteration,
		currentType,
		startClosed,
		center: preparedCenter,
		interpolations: {
			...interpolations,
			toEasing,
		},
	};
}
