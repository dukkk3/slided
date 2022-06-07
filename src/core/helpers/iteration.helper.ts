import { Interpolation } from "react-spring";

import { inlineSwitch } from "@core/utils";

export function switchInterpolation(
	type: "opening" | "closing",
	openingInterpolation: Interpolation<number, number>,
	closingInterpolation: Interpolation<number, number>
) {
	return inlineSwitch(type === "opening", openingInterpolation, closingInterpolation);
}
