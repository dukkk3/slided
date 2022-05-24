import { useMemo } from "react";

import { useIterationControls } from "@core/hooks";
import { clamp } from "@core/utils";

export function useIteration(iteration: number, offset: number = 0.5) {
	const iterationControls = useIterationControls();
	const start = useMemo(
		() => clamp(iteration - offset, 0, iterationControls.iterations),
		[iteration, iterationControls.iterations, offset]
	);
	const end = useMemo(
		() => clamp(iteration + offset, 0, iterationControls.iterations),
		[iteration, iterationControls.iterations, offset]
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
