import { easings } from "react-spring";

import { step, toRange } from "@core/utils/math.utils";

export const interpolations = {
	range: (a: number, b: number) => (value: number) => toRange(value, a, b),
	curve: (a: number, b: number) => (value: number) => Math.sin(toRange(value, a, b) * Math.PI),
	invert: (value: number) => 1 - value,
	noop: (value: number) => value,
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
