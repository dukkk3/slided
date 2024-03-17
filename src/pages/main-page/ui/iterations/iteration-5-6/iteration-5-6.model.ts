import { type SpringUpdate, SpringValue, easings } from "@react-spring/web";
import { createEffect, sample } from "effector";
import { or } from "patronum";

import { interpolators } from "@shared/helpers";
import { common } from "@shared/utils";

import * as model from "../../../main-page.model";

export const pulses = Array(3)
	.fill(0)
	.map(() => new SpringValue(0));
const PULSE_UPDATE_CONFIG: SpringUpdate<number> = {
	from: 0.1,
	to: 1,
	config: { duration: 2000, easing: easings.linear },
	loop: true,
};

export const $iteration5 = model.createStoreUtilsOfFlowIteration(5);
export const iteration5 = model.createSpringUtilsOfFlowIteration(5);

export const $iteration6 = model.createStoreUtilsOfFlowIteration(6);
export const iteration6 = model.createSpringUtilsOfFlowIteration(6);

export const $iteration5Status = or($iteration5.opening.$inFlight, $iteration5.closing.$inFlight);

export const $inRange5_6 = model.$progress.map(
	interpolators.toInRange(iteration5.opening.range[0], iteration6.closing.range[1])
);

const animatePulses = async () => {
	for (let i = 0; i < pulses.length; i++) {
		const pulse = pulses[i];
		pulse.start(PULSE_UPDATE_CONFIG);
		if (i !== pulses.length - 1) {
			await common.wait(1700);
		}
	}
};

const stopPulsesAnimation = () => {
	pulses.forEach((pulse) => pulse.stop());
};

sample({
	clock: $iteration5Status,
	target: createEffect((status: boolean) => {
		if (status) {
			animatePulses();
		} else {
			stopPulsesAnimation();
		}
	}),
});
