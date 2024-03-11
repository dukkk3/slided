import { iterationsChain, ImageKitPreloader } from "@shared/helpers";

import * as model from "../../main-page.model";

export const { ITERATIONS_CHAIN } = model;
export const PRELOADED_IMAGES_COUNT_PER_STEP = 30;
export const LAST_OPENING_IMAGE_INDEX = 80;
export const IMAGES_PARTS: { iterationIndex: number; toImageIndex: number }[] = [
	{ iterationIndex: 0, toImageIndex: 160 },
	{ iterationIndex: 1, toImageIndex: 239 },
	{ iterationIndex: 2, toImageIndex: 283 },
];

export const IMAGES_PRELOADER = new ImageKitPreloader(IMAGES_PARTS.at(-1)!.toImageIndex, "table");
