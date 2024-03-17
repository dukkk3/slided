import { createEffect, sample } from "effector";

import { imageDrawer, interpolators } from "@shared/helpers";
import { math } from "@shared/utils";

import * as model from "../../../main-page.model";
import { presentationModel } from "../../presentation";

import { IMAGES_PRELOADER } from "./iteration-7-8.config";

const { Canvas: PresentationCanvas, imageSetted: presentationImageSetted } = imageDrawer.create();

export const { useRect: usePresentationRect } = presentationModel.presentationShapeInterpolator;

export { PresentationCanvas };

export const $iteration6 = model.createStoreUtilsOfFlowIteration(6);

export const $iteration7 = model.createStoreUtilsOfFlowIteration(7);
export const iteration7 = model.createSpringUtilsOfFlowIteration(7);

export const $iteration8 = model.createStoreUtilsOfFlowIteration(8);
export const iteration8 = model.createSpringUtilsOfFlowIteration(8);

export const $inRange7_8 = model.$progress.map(
	interpolators.toInRange(iteration7.opening.range[0], iteration7.closing.range[1])
);

sample({
	clock: $iteration6.opening.$started,
	filter: Boolean,
	target: createEffect(() => IMAGES_PRELOADER.preloadAll()),
});

sample({
	clock: $iteration7.closing.$progress,
	fn: (value) => IMAGES_PRELOADER.items[math.toInt(value, 0, IMAGES_PRELOADER.imagesCount)].image,
	target: presentationImageSetted,
});
