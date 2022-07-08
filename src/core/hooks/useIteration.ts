// import { useCallback, useMemo } from "react";

// import { useIterationsContext } from "./useIterationsContext";
// import { useLocalStore } from "./useLocalStore";
// import { clamp } from "@core/utils/math.utils";

// export interface Options {
// 	offsetAroundCenter?: number;
// 	startOffset?: number;
// 	endOffset?: number;
// }

// export function useIteration(
// 	iteration: number,
// 	{ startOffset = 0.5, endOffset = 0.5, offsetAroundCenter = 0.001 }: Options = {}
// ) {
// 	const iterationsContext = useIterationsContext();
// 	const center = useMemo(
// 		() => ({ fromStart: iteration - offsetAroundCenter, toEnd: iteration + offsetAroundCenter }),
// 		[iteration, offsetAroundCenter]
// 	);
// 	const start = useMemo(
// 		() => clamp(iteration - startOffset, 0, iterationsContext.iterations),
// 		[iteration, iterationsContext, startOffset]
// 	);
// 	const end = useMemo(
// 		() => clamp(iteration + endOffset, 0, iterationsContext.iterations + endOffset),
// 		[endOffset, iteration, iterationsContext]
// 	);

// 	const durationFactorOpening = useMemo(
// 		() => 1 / iterationsContext.getDurationFactorOnRange(start, center.fromStart),
// 		[iterationsContext, start, center]
// 	);

// 	const durationFactorClosing = useMemo(
// 		() => 1 / iterationsContext.getDurationFactorOnRange(center.toEnd, end),
// 		[iterationsContext, end, center]
// 	);

// 	const localStore = useLocalStore({
// 		get started() {
// 			return iterationsContext.store.compare(start, "lte");
// 		},
// 		get ended() {
// 			return iterationsContext.store.compare(end, "lte");
// 		},
// 		get opened() {
// 			return iterationsContext.store.compare(center.fromStart, "lte");
// 		},
// 		get startClosed() {
// 			return iterationsContext.store.compare(center.toEnd, "lte");
// 		},
// 		get closed() {
// 			return this.startClosed && this.ended;
// 		},
// 		get currentType() {
// 			return this.visibleOpening ? "opening" : "closing";
// 		},
// 		get visibleOpening() {
// 			return iterationsContext.store.inRange(start, center.fromStart);
// 		},
// 		get visibleClosing() {
// 			return iterationsContext.store.inRange(center.toEnd, end);
// 		},
// 		get visible() {
// 			return iterationsContext.store.inRange(start, end);
// 		},
// 	});

// 	const visible = useCallback(
// 		(type?: "opening" | "closing") => {
// 			switch (type) {
// 				case "opening":
// 					return localStore.visibleOpening;
// 				case "closing":
// 					return localStore.visibleClosing;
// 				default:
// 					return localStore.visible;
// 			}
// 		},
// 		[localStore]
// 	);

// 	const started = useCallback(() => {
// 		return localStore.started;
// 	}, [localStore]);

// 	const ended = useCallback(() => {
// 		return localStore.ended;
// 	}, [localStore]);

// 	const opened = useCallback(() => {
// 		return localStore.opened;
// 	}, [localStore]);

// 	const startClosed = useCallback(() => {
// 		return localStore.startClosed;
// 	}, [localStore]);

// 	const closed = useCallback(() => {
// 		return localStore.closed;
// 	}, [localStore]);

// 	const currentState = useCallback(() => {
// 		return localStore.currentType;
// 	}, [localStore]);

// 	const interpolations = useMemo(
// 		() => ({
// 			opening: iterationsContext.animated.toRange(start, center.fromStart),
// 			closing: iterationsContext.animated.toRange(center.toEnd, end),
// 		}),
// 		[center.fromStart, center.toEnd, end, iterationsContext, start]
// 	);

// 	const ranges = useMemo(
// 		() => ({
// 			opening: () => iterationsContext.store.toRange(start, center.fromStart),
// 			closing: () => iterationsContext.store.toRange(center.toEnd, end),
// 		}),
// 		[center.fromStart, center.toEnd, end, iterationsContext, start]
// 	);

// 	return {
// 		end,
// 		start,
// 		ended,
// 		center,
// 		opened,
// 		closed,
// 		ranges,
// 		visible,
// 		started,
// 		iteration,
// 		startClosed,
// 		currentState,
// 		interpolations,
// 		durationFactorOpening,
// 		durationFactorClosing,
// 	};
// }
export {};
