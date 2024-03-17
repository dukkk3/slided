import { ImageKitPreloader } from "@shared/helpers";

export const IMAGES_PRELOADER = new ImageKitPreloader(125, "presentation/16x9");
export const CAR_TEMPLATE_SOURCE = IMAGES_PRELOADER.sources.at(-1)!;
export const PERSPECTIVE = 10;
export const ZOOM = 2;
