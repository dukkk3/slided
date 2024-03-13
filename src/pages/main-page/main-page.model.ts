import type { Store } from "effector";

import { iterationControls, iterationUtils } from "@shared/helpers";
import type { LikeSpringValue, Range } from "@shared/types";

import { ITERATIONS_CHAIN } from "./main-page.config";

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

export const createStoreUtilsOfFlowIteration = (
	flowIteration: number,
	config: Omit<iterationUtils.SharedCreateFlowIterationUtilsProps<Store<number>>, "progress"> = {}
) =>
	iterationUtils.createStoreUtilsOfFlowIteration(flowIteration, { ...config, progress: $progress });

export const createSpringUtilsOfFlowIteration = (
	flowIteration: number,
	config: Omit<
		iterationUtils.SharedCreateFlowIterationUtilsProps<LikeSpringValue<number>>,
		"progress"
	> = {}
) => iterationUtils.createSpringUtilsOfFlowIteration(flowIteration, { ...config, progress });

export const createStoreUtils = (
	rangeOrIterationIndex: Range | number,
	config: Omit<iterationUtils.SharedCreateIterationUtilsProps<Store<number>>, "progress"> = {}
) =>
	iterationUtils.createStoreUtils(rangeOrIterationIndex, ITERATIONS_CHAIN, {
		...config,
		progress: $progress,
	});

export const createSpringUtils = (
	rangeOrIterationIndex: Range | number,
	config: Omit<
		iterationUtils.SharedCreateIterationUtilsProps<LikeSpringValue<number>>,
		"progress"
	> = {}
) =>
	iterationUtils.createSpringUtils(rangeOrIterationIndex, ITERATIONS_CHAIN, { ...config, progress });
