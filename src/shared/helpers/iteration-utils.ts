import { combine, type Store } from "effector";

import type { LikeSpringValue, Range } from "@shared/types";

import { math } from "../utils";

import { type IterationsChain, findItemByRange } from "./iterations-chain";

const toRange = (from: number, to: number) => math.carriedToRange(from, to);

const resolveRange = (
	rangeOrIterationIndex: Range | number,
	iterationsChain: IterationsChain
): Range => {
	if (typeof rangeOrIterationIndex === "number") {
		const iteration = iterationsChain[rangeOrIterationIndex];
		return [iteration.from, iteration.to] as const;
	}

	return rangeOrIterationIndex;
};

const DEFAULT_OFFSET_FROM_CENTER = 0.5;
const DEFAULT_OPENING_RANGE: Range = [0, 0 + DEFAULT_OFFSET_FROM_CENTER];
const DEFAULT_CLOSING_RANGE: Range = [1 - DEFAULT_OFFSET_FROM_CENTER, 1];
const DEFAULT_OFFSET_AROUND_CENTER = math.EPSILON;

export interface SharedCreateIterationUtilsProps<Progress> {
	progress: Progress;
	openingRange?: Range;
	closingRange?: Range;
	offsetAroundCenter?: number;
}

export interface SharedCreateFlowIterationUtilsProps<Value>
	extends Pick<SharedCreateIterationUtilsProps<Value>, "progress"> {
	iterationsChain: IterationsChain;
	offsetFromCenter?: number;
}

const getDurationFactor = (defaultDuration: number, duration: number | undefined = 0) => {
	return duration / defaultDuration;
};

const createCommonStoreUtils = (
	rangeOrIterationIndex: Range | number,
	iterationsChain: IterationsChain,
	progress: Store<number>
) => {
	const range = resolveRange(rangeOrIterationIndex, iterationsChain);
	const iterationItem = findItemByRange(iterationsChain, range);
	const durationFactor = getDurationFactor(iterationsChain.defaultDuration, iterationItem?.duration);

	const $iterationProgress = progress.map(toRange(...range));
	const $status = $iterationProgress.map(math.toStatus);
	const $inFlight = $iterationProgress.map(math.toInFlight);
	const $started = combine({ progress: $iterationProgress }, ({ progress }) => progress > 0);
	const $ended = combine(
		{ started: $started, inFlight: $inFlight },
		({ started, inFlight }) => started && !inFlight
	);

	return {
		range,
		durationFactor,
		$status,
		$started,
		$ended,
		$inFlight,
		$progress: $iterationProgress,
	};
};

export type StoreUtilsOfFlowIteration = ReturnType<typeof createStoreUtilsOfFlowIteration>;

export const createStoreUtilsOfFlowIteration = (
	flowIteration: number,
	{
		progress,
		iterationsChain,
		offsetFromCenter = DEFAULT_OFFSET_FROM_CENTER,
	}: SharedCreateFlowIterationUtilsProps<Store<number>>
) => {
	return {
		opening: createCommonStoreUtils(
			[flowIteration - offsetFromCenter + DEFAULT_OFFSET_AROUND_CENTER, flowIteration],
			iterationsChain,
			progress
		),
		closing: createCommonStoreUtils(
			[flowIteration, flowIteration + offsetFromCenter - DEFAULT_OFFSET_AROUND_CENTER],
			iterationsChain,
			progress
		),
	};
};

export const createStoreUtils = (
	rangeOrIterationIndex: Range | number,
	iterationsChain: IterationsChain,
	{
		progress,
		openingRange = DEFAULT_OPENING_RANGE,
		closingRange = DEFAULT_CLOSING_RANGE,
		offsetAroundCenter = DEFAULT_OFFSET_AROUND_CENTER,
	}: SharedCreateIterationUtilsProps<Store<number>>
) => {
	const { $progress, ...rest } = createCommonStoreUtils(
		rangeOrIterationIndex,
		iterationsChain,
		progress
	);

	return {
		...rest,
		opening: createCommonStoreUtils(
			[openingRange[0], openingRange[1] - offsetAroundCenter],
			iterationsChain,
			$progress
		),
		closing: createCommonStoreUtils(
			[closingRange[0] + offsetAroundCenter, openingRange[1]],
			iterationsChain,
			$progress
		),
		extends: (
			range: Range,
			config: Omit<SharedCreateIterationUtilsProps<Store<number>>, "progress">
		) => createStoreUtils(range, iterationsChain, { ...config, progress: $progress }),
	};
};

const createCommonSpringUtils = (
	rangeOrIterationIndex: Range | number,
	iterationsChain: IterationsChain,
	progress: LikeSpringValue<number>
) => {
	const range = resolveRange(rangeOrIterationIndex, iterationsChain);
	const iterationProgress = progress.to(toRange(...range));
	const iterationItem = findItemByRange(iterationsChain, range);
	const durationFactor = getDurationFactor(iterationsChain.defaultDuration, iterationItem?.duration);
	return {
		range,
		durationFactor,
		progress: iterationProgress,
	};
};

export type SpringUtilsOfFlowIteration = ReturnType<typeof createSpringUtilsOfFlowIteration>;

export const createSpringUtilsOfFlowIteration = (
	flowIteration: number,
	{
		progress,
		iterationsChain,
		offsetFromCenter = DEFAULT_OFFSET_FROM_CENTER,
	}: SharedCreateFlowIterationUtilsProps<LikeSpringValue<number>>
) => {
	return {
		opening: createCommonSpringUtils(
			[flowIteration - offsetFromCenter + DEFAULT_OFFSET_AROUND_CENTER, flowIteration],
			iterationsChain,
			progress
		),
		closing: createCommonSpringUtils(
			[flowIteration, flowIteration + offsetFromCenter - DEFAULT_OFFSET_AROUND_CENTER],
			iterationsChain,
			progress
		),
	};
};

export const createSpringUtils = (
	rangeOrIterationIndex: Range | number,
	iterationsChain: IterationsChain,
	{
		progress,
		openingRange = DEFAULT_OPENING_RANGE,
		closingRange = DEFAULT_CLOSING_RANGE,
		offsetAroundCenter = DEFAULT_OFFSET_AROUND_CENTER,
	}: SharedCreateIterationUtilsProps<LikeSpringValue<number>>
) => {
	const { progress: _progress, ...rest } = createCommonSpringUtils(
		rangeOrIterationIndex,
		iterationsChain,
		progress
	);

	return {
		...rest,
		progress: _progress,
		opening: createCommonSpringUtils(
			[openingRange[0], openingRange[1] - offsetAroundCenter],
			iterationsChain,
			_progress
		),
		closing: createCommonSpringUtils(
			[closingRange[0] + offsetAroundCenter, closingRange[1]],
			iterationsChain,
			_progress
		),
		extends: (
			range: Range,
			config: Omit<SharedCreateIterationUtilsProps<LikeSpringValue<number>>, "progress">
		) => createSpringUtils(range, iterationsChain, { progress: _progress, ...config }),
	};
};
