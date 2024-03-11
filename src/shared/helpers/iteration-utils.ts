import { Store } from "effector";
import { Interpolation, SpringValue } from "@react-spring/web";

import { IterationsChain } from "./iterations-chain";

import { math } from "../utils";

const toRange = (from: number, to: number) => math.carriedToRange(from, to);

type Range = [from: number, to: number];

const resolveRange = (rangeOrIterationIndex: Range | number, iterationsChain: IterationsChain) => {
	if (typeof rangeOrIterationIndex === "number") {
		const iteration = iterationsChain[rangeOrIterationIndex];
		return [iteration.from, iteration.to] as const;
	}

	return rangeOrIterationIndex;
};

export const createStoreUtils = (
	rangeOrIterationIndex: Range | number,
	iterationsChain: IterationsChain,
	$progress: Store<number>
) => {
	const range = resolveRange(rangeOrIterationIndex, iterationsChain);
	const $iterationProgress = $progress.map(toRange(...range));
	const $status = $iterationProgress.map(math.toStatus);
	const $inFlight = $iterationProgress.map(math.toInFlight);

	return {
		range,
		$status,
		$inFlight,
		$progress: $iterationProgress,
		subRange: (range: Range) => createStoreUtils(range, iterationsChain, $iterationProgress),
	};
};

export const createSpringUtils = (
	rangeOrIterationIndex: Range | number,
	iterationsChain: IterationsChain,
	progress: Interpolation<any, number> | SpringValue<number>
) => {
	const range = resolveRange(rangeOrIterationIndex, iterationsChain);
	const iterationProgress = progress.to(toRange(...range));

	return {
		range,
		progress: iterationProgress,
		subRange: (range: Range) => createSpringUtils(range, iterationsChain, iterationProgress),
	};
};
