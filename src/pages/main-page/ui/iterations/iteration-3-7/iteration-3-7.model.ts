import { sample } from "effector";
import { or } from "patronum";

import { interpolations } from "@shared/helpers";

import * as model from "../../../main-page.model";
import { assistantShapeInterpolator } from "../../assistant/assistant.model";

export const { useRect: useAssistantShapeRect } = assistantShapeInterpolator;

export const iteration3 = model.createSpringUtilsOfFlowIteration(3);
export const $iteration3 = model.createStoreUtilsOfFlowIteration(3);
export const $iteration3Status = or($iteration3.opening.$status, $iteration3.closing.$status);

export const iteration4 = model.createSpringUtilsOfFlowIteration(4);
export const $iteration4 = model.createStoreUtilsOfFlowIteration(4);
export const $iteration4Status = or($iteration4.opening.$status, $iteration4.closing.$status);

export const iteration5 = model.createSpringUtilsOfFlowIteration(5);
export const $iteration5 = model.createStoreUtilsOfFlowIteration(5);

export const iteration6 = model.createSpringUtilsOfFlowIteration(6);
export const $iteration6 = model.createStoreUtilsOfFlowIteration(6);

export const iteration7 = model.createSpringUtilsOfFlowIteration(7);
export const iteration8 = model.createSpringUtilsOfFlowIteration(8);

export const $inRange3_7 = model.$progress.map(
	interpolations.toInRange(iteration3.opening.range[0], iteration7.closing.range[0])
);

sample({
	clock: or($iteration3Status, $iteration4Status),
	filter: Boolean,
	fn: () => ({
		to: "in-phone" as const,
		progress: iteration3.opening.progress.to(interpolations.toEased("easeInOutCubic")),
	}),
	target: assistantShapeInterpolator.attach,
});
