import { iterationsChain, ImageKitPreloader } from "@shared/helpers";

export const ITERATIONS_CHAIN = iterationsChain
	.create(2000)
	.next(1)
	.next(2)
	.next(3)
	.next(4)
	.next(6)
	.next(7)
	.next(8)
	.next(9)
	.next(10)
	.next(11)
	.get();

export const MAX_ITERATION_NUMBER = ITERATIONS_CHAIN.rightBound;

export const BACKGROUND_IMAGES_PRELOADER = new ImageKitPreloader(283, "table");
export const ASSISTANT_IMAGES_PRELOADER = new ImageKitPreloader(24, "assistant");
export const PRESENTATION_IMAGES_PRELOADER = new ImageKitPreloader(125, "presentation/16x9");
