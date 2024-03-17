import type { Store } from "effector";

import { iterationControls, iterationUtils, sharedRect } from "@shared/helpers";
import type { LikeSpringValue, Range } from "@shared/types";

import { ITERATIONS_CHAIN } from "./main-page.config";

export const { useRect: usePresentationCardRect, useRectOf: usePresentationCardRectOf } =
	sharedRect.create();

export const {
	progress,
	$progress,
	$previousProgress,
	$currentIterationIndex,
	$iterationRunDirection,
	$smoothedDistanceOfBiggestStep,
	toProgressRunned,
	toIterationRunned,
	iterationSlided,
	smoothedDistanceOfBiggestStep,
} = iterationControls.create({
	iterationsChain: ITERATIONS_CHAIN,
});

export const createStoreUtilsOfFlowIteration = (
	flowIteration: number,
	config: Omit<
		iterationUtils.SharedCreateFlowIterationUtilsProps<Store<number>>,
		"progress" | "iterationsChain"
	> = {}
) =>
	iterationUtils.createStoreUtilsOfFlowIteration(flowIteration, {
		...config,
		progress: $progress,
		iterationsChain: ITERATIONS_CHAIN,
	});

export const createSpringUtilsOfFlowIteration = (
	flowIteration: number,
	config: Omit<
		iterationUtils.SharedCreateFlowIterationUtilsProps<LikeSpringValue<number>>,
		"progress" | "iterationsChain"
	> = {}
) =>
	iterationUtils.createSpringUtilsOfFlowIteration(flowIteration, {
		...config,
		progress,
		iterationsChain: ITERATIONS_CHAIN,
	});

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
