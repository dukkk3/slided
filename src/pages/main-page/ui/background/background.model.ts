import { attach, createEffect, createEvent, createStore, sample } from "effector";
import { createGate } from "effector-react";

import { storeUtils, imageDrawer } from "@shared/helpers";
import { math } from "@shared/utils";

import * as model from "../../main-page.model";

import {
	ITERATIONS_CHAIN,
	LAST_OPENING_IMAGE_INDEX,
	IMAGES_PARTS,
	IMAGES_PRELOADER,
	PRELOADED_IMAGES_COUNT_PER_STEP,
} from "./background.config";

const ticker = storeUtils.createTicker(30);
const endedOpening = createEvent();

const loadImagesFx = createEffect(async ({ from, to }: { from: number; to: number }) => {
	const images = await IMAGES_PRELOADER.preload(from, to);
	return images;
});

const loadOpeningFx = attach({
	effect: loadImagesFx,
	mapParams: () => ({ from: 0, to: LAST_OPENING_IMAGE_INDEX + PRELOADED_IMAGES_COUNT_PER_STEP }),
});

export const $openingEnded = createStore(false);
export const { Canvas, settedImage: settedCanvasImage } = imageDrawer.create();
export const Gate = createGate();

export const parentModel = model;

const getIterationImagesRange = (iterationIndex: number) => {
	const prevImagePart = IMAGES_PARTS.find((item) => item.iterationIndex === iterationIndex - 1);

	const imagePart = IMAGES_PARTS.find((item) => item.iterationIndex === iterationIndex);

	if (!imagePart) return null;

	const fromImageIndex = prevImagePart?.toImageIndex || LAST_OPENING_IMAGE_INDEX;

	return {
		from: fromImageIndex,
		to: imagePart.toImageIndex,
	};
};

sample({
	clock: model.$progress,
	source: model.$currentIterationIndex,
	filter: $openingEnded,
	fn: (currentIterationIndex: number, progress: number) => ({ currentIterationIndex, progress }),
	target: createEffect(
		({ currentIterationIndex, progress }: { currentIterationIndex: number; progress: number }) => {
			const iterationImagesIndexRange = getIterationImagesRange(currentIterationIndex);

			if (!iterationImagesIndexRange) return;

			const { from, to } = ITERATIONS_CHAIN[currentIterationIndex];
			const imageIndex = math.toInt(
				math.toRange(progress, from, to),
				iterationImagesIndexRange.from,
				iterationImagesIndexRange.to
			);

			const item = IMAGES_PRELOADER.items[imageIndex];
			settedCanvasImage(item.image);
		}
	),
});

sample({
	clock: Gate.status,
	filter: Boolean,
	target: loadOpeningFx,
});

sample({
	clock: ticker.$ticks,
	filter: (ticks) => ticks === LAST_OPENING_IMAGE_INDEX,
	target: endedOpening,
});

sample({
	clock: endedOpening,
	fn: () => true,
	target: $openingEnded,
});

sample({
	clock: model.$progress,
	source: model.$currentIterationIndex,
	filter: $openingEnded,
	fn: (currentIterationIndex) => ({ currentIterationIndex }),
	target: createEffect(({ currentIterationIndex }: { currentIterationIndex: number }) => {
		const iterationImagesIndexRange = getIterationImagesRange(currentIterationIndex);
		if (!iterationImagesIndexRange) return;
		loadImagesFx({ from: iterationImagesIndexRange.from, to: iterationImagesIndexRange.to });
	}),
});

sample({
	clock: ticker.clock,
	source: ticker.$ticks,
	target: createEffect((ticks: number) => {
		const item = IMAGES_PRELOADER.items[ticks];
		settedCanvasImage(item.image);
	}),
});

sample({
	clock: loadOpeningFx.doneData,
	target: ticker.start,
});

// sample({
// 	clock: loadOpeningFx.doneData,
// 	fn: () => ({ from: 0, to: IMAGES_PARTS.at(-1)!.toImageIndex }),
// 	target: loadImagesFx,
// });

sample({
	clock: endedOpening,
	target: ticker.stop,
});
