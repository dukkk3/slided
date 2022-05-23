import { useCallback, useMemo } from "react";

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

	const inRange = useCallback(() => {
		return iterationControls.store.inRange(start, end);
	}, [end, iterationControls, start]);

	const interpolations = useMemo(
		() => [
			iterationControls.animated.toRange(start, iteration),
			iterationControls.animated.toRange(iteration, end),
		],
		[iterationControls, start, iteration, end]
	);

	return { interpolations, inRange };
}
