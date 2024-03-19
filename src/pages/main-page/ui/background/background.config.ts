import * as config from "../../main-page.config";

export const { ITERATIONS_CHAIN } = config;
export const PRELOADED_IMAGES_COUNT_PER_STEP = 30;
export const LAST_OPENING_IMAGE_INDEX = 80;

export const IMAGES_PRELOADER = config.BACKGROUND_IMAGES_PRELOADER;

export const IMAGES_PARTS: { iterationIndex: number; toImageIndex: number }[] = [
	{ iterationIndex: 0, toImageIndex: 160 },
	{ iterationIndex: 1, toImageIndex: 239 },
	{ iterationIndex: 2, toImageIndex: IMAGES_PRELOADER.imagesCount - 1 },
];
