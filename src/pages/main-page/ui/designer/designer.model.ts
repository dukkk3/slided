import { interpolators, shapeInterpolator } from "@shared/helpers";

import * as model from "../../main-page.model";

export const $iteration5 = model.createStoreUtilsOfFlowIteration(5);
export const iteration5 = model.createSpringUtilsOfFlowIteration(5);

export const iteration8 = model.createSpringUtilsOfFlowIteration(8);

export const $inRange5_8 = model.$progress.map(
	interpolators.toInRange(iteration5.opening.range[1], iteration8.opening.range[0])
);

export const designerShapeInterpolator = shapeInterpolator.create<"initial" | "in-phone">(
	"initial",
	[
		{
			from: "initial",
			to: "in-phone",
			progress: iteration5.closing.progress.to(interpolators.toEased("easeInOutCubic")),
			filter: $iteration5.closing.$started,
		},
	]
);
