import { easings, type InterpolatorConfig } from "@react-spring/web";

import { math } from "@shared/utils";

export const {
	carriedToRange: toRanged,
	invert: toInverted,
	toScale: toClampedScaled,
	toStep: toStepped,
} = math;

export const toEased = (ease: keyof typeof easings): InterpolatorConfig<number> => ({
	range: [0, 1],
	output: [0, 1],
	// @ts-expect-error
	easing: easings[ease],
});

export const toInRange = (from: number, to: number) => (value: number) =>
	math.inRange(value, from, to);

export const toScaled = (scale: number) => (value: number) => value * scale;
export const toPercents = (value: number) => `${value}%`;
