import { useCallback, useMemo } from "react";
import { EasingFunction, easings } from "react-spring";

import { useIterationsContext } from "@core/hooks";
import { clamp } from "@core/utils";

interface Options {
	offsetAroundCenter?: number;
	easing?: EasingFunction;
	startOffset?: number;
	endOffset?: number;
}

export function useIterationControls(
	iteration: number,
	{ startOffset = 0.5, endOffset = 0.5, offsetAroundCenter = 0, easing }: Options = {}
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

	const visible = useCallback(
		(type?: "opening" | "closing") => {
			const a = type === "closing" ? center.toEnd : start;
			const b = type === "opening" ? center.fromStart : end;
			return iterationsContext.store.inRange(a, b);
		},
		[center.fromStart, center.toEnd, end, iterationsContext, start]
	);

	const visibleInterpolation = useCallback(
		(type?: "opening" | "closing") => {
			const a = type === "closing" ? center.toEnd : start;
			const b = type === "opening" ? center.fromStart : end;
			return iterationsContext.animated.inRange(a, b);
		},
		[center.fromStart, center.toEnd, end, iterationsContext, start]
	);

	const started = useCallback(() => {
		return iterationsContext.store.compare(start, "lte");
	}, [iterationsContext, start]);

	const startedInterpolation = useCallback(() => {
		return iterationsContext.animated.compare(start, "lte");
	}, [iterationsContext, start]);

	const ended = useCallback(() => {
		return iterationsContext.store.compare(end, "lte");
	}, [end, iterationsContext]);

	const endedInterpolation = useCallback(() => {
		return iterationsContext.animated.compare(end, "lte");
	}, [end, iterationsContext]);

	const opened = useCallback(() => {
		return iterationsContext.store.compare(center.fromStart, "lte");
	}, [center, iterationsContext]);

	const openedInterpolation = useCallback(() => {
		return iterationsContext.animated.compare(center.fromStart, "lte");
	}, [center, iterationsContext]);

	const startClosed = useCallback(() => {
		return iterationsContext.store.compare(center.toEnd, "lte");
	}, [center.toEnd, iterationsContext.store]);

	const startClosedInterpolation = useCallback(() => {
		return iterationsContext.animated.compare(center.toEnd, "lte");
	}, [center, iterationsContext]);

	const closed = useCallback(() => {
		return startClosed() && ended();
	}, [ended, startClosed]);

	const currentType = useCallback(() => {
		return visible("opening") ? "opening" : "closing";
	}, [visible]);

	const interpolations = useMemo(
		() => ({
			opening: iterationsContext.animated.toRange(start, center.fromStart),
			closing: iterationsContext.animated.toRange(center.toEnd, end),
		}),
		[center.fromStart, center.toEnd, end, iterationsContext, start]
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
			opening: () => iterationsContext.store.toRange(start, center.fromStart),
			closing: () => iterationsContext.store.toRange(center.toEnd, end),
		}),
		[center.fromStart, center.toEnd, end, iterationsContext, start]
	);

	return {
		end,
		start,
		started,
		center,
		ended,
		opened,
		closed,
		ranges,
		visible,
		iteration,
		currentType,
		startClosed,
		endedInterpolation,
		openedInterpolation,
		visibleInterpolation,
		startedInterpolation,
		startClosedInterpolation,
		interpolations: {
			...interpolations,
			toEasing,
		},
	};
}
