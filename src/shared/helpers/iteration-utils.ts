import { Store } from "effector";
import { Interpolation, SpringValue } from "@react-spring/web";

import { $progress as _$progress, progress as _progress } from "../model";
import { ITERATIONS_CHAIN } from "../iterations";
import { math } from "../utils";

const toRange = (from: number, to: number) => math.carriedToRange(from, to);

type Range = [from: number, to: number];

const resolveRange = (rangeOrIterationIndex: Range | number) => {
	if (typeof rangeOrIterationIndex === "number") {
		const iteration = ITERATIONS_CHAIN[rangeOrIterationIndex];
		return [iteration.from, iteration.to] as const;
	}

	return rangeOrIterationIndex;
};

export const createStoreUtils = (
	rangeOrIterationIndex: Range | number,
	$progress: Store<number> = _$progress
) => {
	const range = resolveRange(rangeOrIterationIndex);
	const $iterationProgress = $progress.map(toRange(...range));
	const $status = $iterationProgress.map(math.toStatus);
	const $inFlight = $iterationProgress.map(math.toInFlight);

	return {
		range,
		$status,
		$inFlight,
		$progress: $iterationProgress,
		subRange: (range: Range) => createStoreUtils(range, $iterationProgress),
	};
};

export const createSpringUtils = (
	rangeOrIterationIndex: Range | number,
	progress: Interpolation<any, number> | SpringValue<number> = _progress
) => {
	const range = resolveRange(rangeOrIterationIndex);
	const iterationProgress = progress.to(toRange(...range));

	return {
		range,
		progress: iterationProgress,
		subRange: (range: Range) => createSpringUtils(range, iterationProgress),
	};
};
