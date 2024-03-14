import { SpringValue } from "@react-spring/web";
import { createEffect, sample } from "effector";
import { createGate } from "effector-react";

import { imageDrawer, shapeInterpolator } from "@shared/helpers";
import { math } from "@shared/utils";

import * as model from "../../main-page.model";

import { IMAGES_PRELOADER } from "./assistant.config";

const pulse = new SpringValue(0);

export const assistantShapeInterpolator = shapeInterpolator.create<"initial" | "in-phone">(
	"initial"
);
export const iteration1 = model.createSpringUtilsOfFlowIteration(1);

export const $iteration1 = model.createStoreUtilsOfFlowIteration(1);

export const Gate = createGate();

export const pulseProgress = pulse.to({
	range: [0, 0.25, 0.5, 0.75, 1],
	output: [1, 1.1, 1.05, 1.1, 1],
});

const { Canvas, settedImage: settedAssistantImage } = imageDrawer.create();

export const AssistantCanvas = Canvas;

sample({
	clock: $iteration1.opening.$ended,
	filter: Gate.status,
	target: createEffect((ended: boolean) => {
		if (ended) {
			pulse.start({
				from: 0,
				to: 1,
				loop: { reverse: true },
				config: { friction: 20, tension: 75 },
			});
		} else {
			pulse.stop();
		}
	}),
});

sample({
	clock: $iteration1.opening.$progress,
	filter: Gate.status,
	fn: (progress) => {
		const imageIndex = math.toInt(progress, 0, IMAGES_PRELOADER.imagesCount - 1);
		return IMAGES_PRELOADER.items[imageIndex].image;
	},
	target: settedAssistantImage,
});

sample({
	clock: Gate.status,
	filter: Boolean,
	target: createEffect(() => IMAGES_PRELOADER.preloadAll()),
});
