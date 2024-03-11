import { iterationControls, iterationsChain } from "@shared/helpers";

export const ITERATIONS_CHAIN = iterationsChain
	.create()
	.next(1, { duration: 2000 })
	.next(2, { duration: 2000 })
	.next(3, { duration: 2000 })
	.next(4, { duration: 2000 })
	.get();

export const {
	progress,
	$progress,
	$previousProgress,
	$currentIterationIndex,
	$iterationRunDirection,
	$smoothedDistanceOfBiggestStep,
	runToIteration,
	runToProgress,
	slideIteration,
	smoothedDistanceOfBiggestStep,
} = iterationControls.create({
	iterationsChain: ITERATIONS_CHAIN,
});
