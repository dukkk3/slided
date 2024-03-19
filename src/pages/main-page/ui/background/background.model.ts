import { createEffect, sample } from "effector";
import { createGate } from "effector-react";
import { and, not, or } from "patronum";

import { storeUtils, imageDrawer } from "@shared/helpers";
import { math } from "@shared/utils";

import * as model from "../../main-page.model";

import {
	ITERATIONS_CHAIN,
	LAST_OPENING_IMAGE_INDEX,
	IMAGES_PARTS,
	IMAGES_PRELOADER,
} from "./background.config";

const ticker = storeUtils.createTicker(30);

const $progressMore0 = model.$progress.map((progress) => progress > 0);

export const { Canvas, imageSetted: canvasImageSetted } = imageDrawer.create();
export const Gate = createGate();

export const parentModel = model;

const getIterationImagesRange = (iterationIndex: number) => {
	const prevImagePart = IMAGES_PARTS.find((item) => item.iterationIndex === iterationIndex - 1);
	const imagePart = IMAGES_PARTS.find((item) => item.iterationIndex === iterationIndex);

	if (!imagePart) {
		const lastImagePart = IMAGES_PARTS.at(-1)!;
		return { from: lastImagePart.toImageIndex, to: lastImagePart.toImageIndex };
	}

	const fromImageIndex = prevImagePart?.toImageIndex || LAST_OPENING_IMAGE_INDEX;

	return {
		from: fromImageIndex,
		to: imagePart.toImageIndex,
	};
};

sample({
	source: {
		progress: model.$progress,
		currentIterationIndex: model.$currentIterationIndex,
		animationCanBePlayed: model.$animationCanBePlayed,
	},
	filter: and(or(model.$openingEnded, $progressMore0), model.$animationCanBePlayed),
	fn: ({ currentIterationIndex, progress }) => ({ currentIterationIndex, progress }),
	target: createEffect(
		({ currentIterationIndex, progress }: { currentIterationIndex: number; progress: number }) => {
			const iterationImagesIndexRange = getIterationImagesRange(currentIterationIndex);

			const { from, to } = ITERATIONS_CHAIN[currentIterationIndex];
			const imageIndex = math.toInt(
				math.toRange(progress, from, to),
				iterationImagesIndexRange.from,
				iterationImagesIndexRange.to
			);

			const item = IMAGES_PRELOADER.items[imageIndex];
			canvasImageSetted(item.image);
		}
	),
});

sample({
	clock: ticker.$ticks,
	filter: (ticks) => ticks === LAST_OPENING_IMAGE_INDEX,
	fn: () => true,
	target: model.setOpeningEnded,
});

sample({
	clock: model.$animationCanBePlayed,
	filter: $progressMore0,
	fn: () => true,
	target: model.setOpeningEnded,
});

sample({
	clock: ticker.clock,
	source: ticker.$ticks,
	target: createEffect((ticks: number) => {
		const item = IMAGES_PRELOADER.items[ticks];
		canvasImageSetted(item.image);
	}),
});

sample({
	clock: model.$animationCanBePlayed,
	filter: and(not($progressMore0), model.$animationCanBePlayed),
	target: ticker.start,
});

// sample({
// 	clock: loadOpeningFx.doneData,
// 	fn: () => ({ from: 0, to: IMAGES_PARTS.at(-1)!.toImageIndex }),
// 	target: loadImagesFx,
// });

sample({
	clock: model.$openingEnded,
	filter: Boolean,
	target: ticker.stop,
});
