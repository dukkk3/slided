import { Interpolation, easings } from "react-spring";

import { inlineSwitch, step, toRange } from "@core/utils";

export function switchInterpolation(
	type: "opening" | "closing",
	openingInterpolation: Interpolation<number, number>,
	closingInterpolation: Interpolation<number, number>
) {
	return inlineSwitch(type === "opening", openingInterpolation, closingInterpolation);
}

export const interpolations = {
	range: (a: number, b: number) => (value: number) => toRange(value, a, b),
	invert: (value: number) => 1 - value,
	defaultDuration:
		(durationFactor: number, bound: "in" | "out" = "in") =>
		(value: number) => {
			const clampedFactor = Math.min(1, durationFactor);
			return toRange(
				value,
				bound === "in" || clampedFactor === 1 ? 0 : clampedFactor,
				bound === "in" ? clampedFactor : 1
			);
		},
	easing: (easing: keyof typeof easings) => ({
		range: [0, 1],
		output: [0, 1],
		easing: easings[easing],
	}),
	step: (edge: number) => (value: number) => step(value, edge),
};