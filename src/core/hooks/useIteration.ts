import { useCallback, useMemo } from "react";

import { useIterationControls } from "@core/hooks";
import { clamp } from "@core/utils";

const OFFSET = 0.15;

export function useIteration(
	iteration: number,
	startOffset: number = 0.5,
	endOffset: number = 0.5
) {
	const iterationControls = useIterationControls();
	const fromStartCenter = useMemo(() => iteration - OFFSET, [iteration]);
	const toEndCenter = useMemo(() => iteration + OFFSET, [iteration]);
	const start = useMemo(
		() => clamp(iteration - startOffset, 0, iterationControls.iterations),
		[iteration, iterationControls.iterations, startOffset]
	);
	const end = useMemo(
		() => clamp(iteration + endOffset, 0, iterationControls.iterations),
		[endOffset, iteration, iterationControls]
	);

	const visible = useCallback(() => {
		return iterationControls.store.inRange(start, end);
	}, [end, iterationControls, start]);

	const interpolations = useMemo(
		() => ({
			opening: iterationControls.animated.toRange(start, fromStartCenter),
			closing: iterationControls.animated.toRange(toEndCenter, end),
		}),
		[end, fromStartCenter, iterationControls, start, toEndCenter]
	);

	const ranges = useMemo(
		() => ({
			opening: () => iterationControls.store.toRange(start, fromStartCenter),
			closing: () => iterationControls.store.toRange(toEndCenter, end),
		}),
		[end, fromStartCenter, iterationControls, start, toEndCenter]
	);

	return {
		end,
		start,
		visible,
		toEndCenter,
		fromStartCenter,
		center: iteration,
		interpolations,
		ranges,
	};
}
