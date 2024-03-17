import { or } from "patronum";

import { interpolators } from "@shared/helpers";

import * as model from "../../../main-page.model";
import { assistantModel } from "../../assistant";
import { designerModel } from "../../designer";

export const { useRect: useAssistantShapeRect } = assistantModel.assistantShapeInterpolator;
export const { useRect: useDesignerShapeRect } = designerModel.designerShapeInterpolator;

export const iteration3 = model.createSpringUtilsOfFlowIteration(3);
export const $iteration3 = model.createStoreUtilsOfFlowIteration(3);
export const $iteration3Status = or($iteration3.opening.$inFlight, $iteration3.closing.$inFlight);

export const iteration4 = model.createSpringUtilsOfFlowIteration(4);
export const $iteration4 = model.createStoreUtilsOfFlowIteration(4);
export const $iteration4Status = or($iteration4.opening.$inFlight, $iteration4.closing.$inFlight);

export const iteration5 = model.createSpringUtilsOfFlowIteration(5);
export const $iteration5 = model.createStoreUtilsOfFlowIteration(5);

export const iteration6 = model.createSpringUtilsOfFlowIteration(6);
export const $iteration6 = model.createStoreUtilsOfFlowIteration(6);

export const iteration7 = model.createSpringUtilsOfFlowIteration(7);
export const iteration8 = model.createSpringUtilsOfFlowIteration(8);

export const $inRange4_5 = model.$progress.map(
	interpolators.toInRange(iteration4.closing.range[0], iteration5.closing.range[1])
);

export const $inRange3_7 = model.$progress.map(
	interpolators.toInRange(iteration3.opening.range[0], iteration7.opening.range[1])
);

export const $inRange3_4 = model.$progress.map(
	interpolators.toInRange(iteration3.opening.range[0], iteration4.closing.range[1])
);

export const $inRange6_7 = model.$progress.map(
	interpolators.toInRange(iteration6.opening.range[0], iteration7.closing.range[1])
);

export const $iteration5Status = or($iteration5.opening.$inFlight, $iteration5.closing.$inFlight);

// sample({
// 	clock: or($iteration3Status, $iteration4Status),
// 	filter: Boolean,
// 	fn: () => ({
// 		to: "in-phone" as const,
// 		progress: iteration3.opening.progress.to(interpolators.toEased("easeInOutCubic")),
// 	}),
// 	target: assistantShapeInterpolator.attach,
// });
