import { useMemo } from "react";

import { useIterationControls } from "@core/hooks";
import { clamp } from "@core/utils";

export function useIteration(
	iteration: number,
	startOffset: number = 0.5,
	endOffset: number = 0.5
) {
	const iterationControls = useIterationControls();
	const start = useMemo(
		() => clamp(iteration - startOffset, 0, iterationControls.iterations),
		[iteration, iterationControls.iterations, startOffset]
	);
	const end = useMemo(
		() => clamp(iteration + endOffset, 0, iterationControls.iterations),
		[endOffset, iteration, iterationControls]
	);

	const interpolations = useMemo(
		() => [
			iterationControls.animated.toRange(start, iteration),
			iterationControls.animated.toRange(iteration, end),
		],
		[end, iteration, iterationControls, start]
	);

	return { start, end, center: iteration, interpolations };
}
