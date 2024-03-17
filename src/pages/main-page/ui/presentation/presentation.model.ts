import { interpolators, shapeInterpolator } from "@shared/helpers";

import * as model from "../../main-page.model";

export const iteration8 = model.createSpringUtilsOfFlowIteration(8);
export const $iteration8 = model.createStoreUtilsOfFlowIteration(8);

export const iteration9 = model.createSpringUtilsOfFlowIteration(9);
export const $iteration9 = model.createStoreUtilsOfFlowIteration(9);

export const $inRange8_9 = model.$progress.map(
	interpolators.toInRange(iteration8.opening.range[0], iteration9.closing.range[1])
);

export const presentationShapeInterpolator = shapeInterpolator.create<
	"initial" | "in-phone" | "in-phone-shifted" | "in-grid"
>("initial", [
	{
		from: "initial",
		to: "in-phone",
		progress: iteration8.opening.progress.to(interpolators.toEased("easeInOutCubic")),
		filter: $iteration8.opening.$started,
	},
	{
		from: "in-phone",
		to: "in-phone-shifted",
		progress: iteration9.opening.progress.to(interpolators.toEased("easeInOutCubic")),
		filter: $iteration9.opening.$started,
	},
	{
		from: "in-phone-shifted",
		to: "in-grid",
		progress: iteration9.closing.progress.to(interpolators.toEased("easeInOutCubic")),
		filter: $iteration9.closing.$started,
	},
]);
