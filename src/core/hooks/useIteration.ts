import { useCallback, useMemo } from "react";

import { useIterationControls } from "@core/hooks";
import { clamp } from "@core/utils";

interface Options {
	offsetAroundCenter?: number;
	startOffset?: number;
	endOffset?: number;
}

export function useIteration(
	iteration: number,
	{ startOffset = 0.5, endOffset = 0.5, offsetAroundCenter = 0.15 }: Options = {}
) {
	const iterationControls = useIterationControls();
	const center = useMemo(
		() => ({ fromStart: iteration - offsetAroundCenter, toEnd: iteration + offsetAroundCenter }),
		[iteration, offsetAroundCenter]
	);
	const start = useMemo(
		() => clamp(iteration - startOffset, 0, iterationControls.iterations),
		[iteration, iterationControls.iterations, startOffset]
	);
	const end = useMemo(
		() => clamp(iteration + endOffset, 0, iterationControls.iterations),
		[endOffset, iteration, iterationControls]
	);

	const visible = useCallback(
		(type?: "opening" | "closing") => {
			const a = type === "closing" ? center.toEnd : start;
			const b = type === "opening" ? center.fromStart : end;
			return iterationControls.store.inRange(a, b);
		},
		[center.fromStart, center.toEnd, end, iterationControls.store, start]
	);

	const started = useCallback(() => {
		return iterationControls.store.compare(start, "lte");
	}, [iterationControls, start]);

	const ended = useCallback(() => {
		return iterationControls.store.compare(end, "lte");
	}, [end, iterationControls]);

	const opened = useCallback(() => {
		return iterationControls.store.compare(center.fromStart, "lte");
	}, [center, iterationControls]);

	const startClosed = useCallback(() => {
		return iterationControls.store.compare(center.toEnd, "lte");
	}, [center.toEnd, iterationControls.store]);

	const closed = useCallback(() => {
		return startClosed() && ended();
	}, [ended, startClosed]);

	const interpolations = useMemo(
		() => ({
			opening: iterationControls.animated.toRange(start, center.fromStart),
			closing: iterationControls.animated.toRange(center.toEnd, end),
		}),
		[center.fromStart, center.toEnd, end, iterationControls.animated, start]
	);

	const ranges = useMemo(
		() => ({
			opening: () => iterationControls.store.toRange(start, center.fromStart),
			closing: () => iterationControls.store.toRange(center.toEnd, end),
		}),
		[center.fromStart, center.toEnd, end, iterationControls.store, start]
	);

	return {
		end,
		start,
		started,
		center,
		startClosed,
		ended,
		opened,
		closed,
		ranges,
		visible,
		iteration,
		interpolations,
	};
}
