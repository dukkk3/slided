import { useCallback, useMemo } from "react";

import { useIterationsControls } from "./useIterationsControls";
import { useLocalStore } from "./useLocalStore";
import { clamp } from "@core/utils/math.utils";

export interface Options {
	offsetAroundCenter?: number;
	startOffset?: number;
	endOffset?: number;
}

export function useIteration(
	iteration: number,
	{ startOffset = 0.5, endOffset = 0.5, offsetAroundCenter = 0.001 }: Options = {}
) {
	const iterationsControls = useIterationsControls();
	const center = useMemo(
		() => ({ fromStart: iteration - offsetAroundCenter, toEnd: iteration + offsetAroundCenter }),
		[iteration, offsetAroundCenter]
	);
	const start = useMemo(
		() => clamp(iteration - startOffset, 0, iterationsControls.iterations),
		[iteration, iterationsControls, startOffset]
	);
	const end = useMemo(
		() => clamp(iteration + endOffset, 0, iterationsControls.iterations + endOffset),
		[endOffset, iteration, iterationsControls]
	);

	const durationFactorOpening = useMemo(
		() => 1 / iterationsControls.getDurationFactorInRange(start, center.fromStart),
		[iterationsControls, start, center]
	);

	const durationFactorClosing = useMemo(
		() => 1 / iterationsControls.getDurationFactorInRange(center.toEnd, end),
		[iterationsControls, end, center]
	);

	const localStore = useLocalStore({
		get started() {
			return iterationsControls.store.compare(start, "lte");
		},
		get ended() {
			return iterationsControls.store.compare(end, "lte");
		},
		get playing() {
			return this.started && !this.ended;
		},
		get opened() {
			return iterationsControls.store.compare(center.fromStart, "lte");
		},
		get closeStarted() {
			return iterationsControls.store.compare(center.toEnd, "lte");
		},
		get closing() {
			return this.closeStarted && !this.ended;
		},
		get currentType() {
			return this.visibleOpening ? "opening" : "closing";
		},
		get visibleOpening() {
			return iterationsControls.store.inRange(start, center.fromStart);
		},
		get visibleClosing() {
			return iterationsControls.store.inRange(center.toEnd, end);
		},
		get visible() {
			return iterationsControls.store.inRange(start, end);
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

	const closeStarted = useCallback(() => {
		return localStore.closeStarted;
	}, [localStore]);

	const closing = useCallback(() => {
		return localStore.closing;
	}, [localStore]);

	const currentState = useCallback(() => {
		return localStore.currentType;
	}, [localStore]);

	const interpolations = useMemo(
		() => ({
			opening: iterationsControls.animated.toRange(start, center.fromStart),
			closing: iterationsControls.animated.toRange(center.toEnd, end),
		}),
		[center.fromStart, center.toEnd, end, iterationsControls, start]
	);

	const ranges = useMemo(
		() => ({
			opening: () => iterationsControls.store.toRange(start, center.fromStart),
			closing: () => iterationsControls.store.toRange(center.toEnd, end),
		}),
		[center.fromStart, center.toEnd, end, iterationsControls, start]
	);

	return {
		end,
		start,
		ended,
		center,
		opened,
		closing,
		ranges,
		visible,
		started,
		iteration,
		closeStarted,
		currentState,
		interpolations,
		durationFactorOpening,
		durationFactorClosing,
	};
}
