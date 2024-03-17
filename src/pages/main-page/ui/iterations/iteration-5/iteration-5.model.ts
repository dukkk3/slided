import { or } from "patronum";

import * as model from "../../../main-page.model";
import { designerModel } from "../../designer";

export const { useRect: useDesignerRect } = designerModel.designerShapeInterpolator;

export const iteration5 = model.createSpringUtilsOfFlowIteration(5);
export const $iteration5 = model.createStoreUtilsOfFlowIteration(5);

export const $iteration5Status = or($iteration5.opening.$inFlight, $iteration5.closing.$inFlight);
