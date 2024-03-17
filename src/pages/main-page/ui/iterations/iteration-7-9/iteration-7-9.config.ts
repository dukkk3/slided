import { presentationConfig } from "../../presentation";

import * as assets from "./assets";

interface Presentation {
	src: string;
	overlaySrc?: string;
}

export const OFFSET_BETWEEN_CARDS = 20;
export const PRESENTATIONS: Presentation[] = [
	{ src: presentationConfig.PRESENTATION_POSTER },
	{ src: assets.presentation, overlaySrc: assets.presentationPlug },
	{ src: assets.presentationPlug },
	{ src: assets.presentationPlug },
	{ src: assets.presentationPlug },
];
