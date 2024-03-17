import { or } from "patronum";

import { interpolators } from "@shared/helpers";

import * as model from "../../../main-page.model";
import { presentationModel } from "../../presentation";

export const { useRect: usePresentationShapeRect } =
	presentationModel.presentationShapeInterpolator;

export const { usePresentationCardRect } = model;

export const $iteration9 = model.createStoreUtilsOfFlowIteration(9);
export const iteration9 = model.createSpringUtilsOfFlowIteration(9);

export const $iteration10 = model.createStoreUtilsOfFlowIteration(10);
export const iteration10 = model.createSpringUtilsOfFlowIteration(10);
export const $iteration10Status = or(
	$iteration10.opening.$inFlight,
	$iteration10.closing.$inFlight
);

export const $inRange9_10 = model.$progress.map(
	interpolators.toInRange(iteration9.closing.range[0], iteration10.closing.range[1])
);
