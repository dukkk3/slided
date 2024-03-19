import { createEffect, createEvent, createStore, restore, sample, type Store } from "effector";
import { createGate } from "effector-react";
import { and, not } from "patronum";

import { iterationControls, iterationUtils, sharedRect } from "@shared/helpers";
import type { LikeSpringValue, Range } from "@shared/types";

import {
	ITERATIONS_CHAIN,
	ASSISTANT_IMAGES_PRELOADER,
	BACKGROUND_IMAGES_PRELOADER,
	PRESENTATION_IMAGES_PRELOADER,
} from "./main-page.config";

export const setLoaderVisible = createEvent<boolean>();
export const setOpeningEnded = createEvent<boolean>();

const preloadImagesFx = createEffect(async () => {
	await Promise.all(
		[ASSISTANT_IMAGES_PRELOADER, BACKGROUND_IMAGES_PRELOADER, PRESENTATION_IMAGES_PRELOADER].map(
			(preloader) => preloader.preloadAll()
		)
	);
	return true;
});

export const $openingEnded = createStore(false);
export const $contentLoaded = restore(preloadImagesFx, false);
export const $loaderVisible = createStore(false);

export const $animationCanBePlayed = and($contentLoaded, not($loaderVisible));
export const $interactiveEnabled = and($animationCanBePlayed, $openingEnded);

export const Gate = createGate();

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

sample({
	clock: Gate.status,
	filter: Boolean,
	target: preloadImagesFx,
});

sample({
	clock: setOpeningEnded,
	target: $openingEnded,
});

sample({
	clock: setLoaderVisible,
	target: $loaderVisible,
});
