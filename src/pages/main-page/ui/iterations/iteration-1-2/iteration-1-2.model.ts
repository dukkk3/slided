import * as model from "../../../main-page.model";
import { assistantShapeInterpolator } from "../../assistant/assistant.model";

export const iteration1 = model.createSpringUtilsOfFlowIteration(1);
export const $iteration1 = model.createStoreUtilsOfFlowIteration(1);

export const iteration2 = model.createSpringUtilsOfFlowIteration(2);
export const $iteration2 = model.createStoreUtilsOfFlowIteration(2);

export const { useRect: useAssistantShapeRect } = assistantShapeInterpolator;
