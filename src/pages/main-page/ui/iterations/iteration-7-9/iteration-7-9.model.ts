import { or } from "patronum";

import { interpolators } from "@shared/helpers";

import * as model from "../../../main-page.model";
import { presentationModel } from "../../presentation";

export const { usePresentationCardRect, usePresentationCardRectOf } = model;

export const { useRect: usePresentationShapeRect } =
	presentationModel.presentationShapeInterpolator;

export const $iteration7 = model.createStoreUtilsOfFlowIteration(7);
export const iteration7 = model.createSpringUtilsOfFlowIteration(7);

export const $iteration8 = model.createStoreUtilsOfFlowIteration(8);
export const iteration8 = model.createSpringUtilsOfFlowIteration(8);
export const $iteration8Status = or($iteration8.opening.$inFlight, $iteration8.closing.$inFlight);

export const $iteration9 = model.createStoreUtilsOfFlowIteration(9);
export const iteration9 = model.createSpringUtilsOfFlowIteration(9);
export const $iteration9Status = or($iteration9.opening.$inFlight, $iteration9.closing.$inFlight);

export const $inRange7_9 = model.$progress.map(
	interpolators.toInRange(iteration7.closing.range[0], iteration9.closing.range[1])
);
