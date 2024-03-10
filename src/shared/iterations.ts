import { combine, createStore, createEvent, sample } from "effector";

import { progress, $progress, $previousProgress } from "./model";
import { iterationsChain } from "./helpers";
import { math } from "./utils";

export const ITERATIONS_CHAIN = iterationsChain.create().next(1, 5000).next(2, 1000).get();

const $settedProgressData = createStore<{ from: number; to: number }>({
	from: 0,
	to: 0,
});

const settedTargetProgress = createEvent<number>();

const calculateDistance = (from: number, to: number) => Math.abs(to - from);
const isBiggestDistance = (distance: number) => distance > 1;

const calculateDistanceOfStep = (
	progress: number,
	settedProgress: { from: number; to: number }
) => {
	const initialDistance = calculateDistance(settedProgress.from, settedProgress.to);
	if (!isBiggestDistance(initialDistance)) return 0;
	const distance = calculateDistance(progress, settedProgress.to);
	return math.clamp(distance, 0, 1);
};

export const $smoothedDistanceOfBiggestStep = combine(
	{ progress: $progress, settedProgress: $settedProgressData },
	({ progress, settedProgress }) => calculateDistanceOfStep(progress, settedProgress)
);

export const smoothedDistanceOfBiggestStep = progress.to((value) =>
	calculateDistanceOfStep(value, $settedProgressData.getState())
);

export const $iterationRunDirection = combine(
	{ progress: $progress, previousProgress: $previousProgress },
	({ progress, previousProgress }) => Math.sign(progress - previousProgress)
);

export const $currentIterationIndex = combine(
	{ progress: $progress, iterationRunDirection: $iterationRunDirection },
	({ progress, iterationRunDirection }) => {
		const iterationItem = iterationsChain.findItem(ITERATIONS_CHAIN, progress, iterationRunDirection);
		return ITERATIONS_CHAIN.indexOf(iterationItem);
	}
);

export const runToIteration = (index: number, toEnd?: boolean) => {
	if (index < 0 || index >= ITERATIONS_CHAIN.length) return;
	runToProgress(ITERATIONS_CHAIN[index][toEnd ? "to" : "from"]);
};

export const slideIteration = (direction: number, toEnd?: boolean) => {
	const currentIterationIndex = $currentIterationIndex.getState();
	runToIteration(currentIterationIndex + direction, toEnd);
};

export const runToProgress = (targetProgress: number) => {
	const currentProgress = $progress.getState();
	const direction = Math.sign(targetProgress - currentProgress);

	if (direction === 0) return;

	progress.stop();

	const currentIterationItem = iterationsChain.findItem(
		ITERATIONS_CHAIN,
		currentProgress,
		direction
	);

	const distanceToBound = calculateDistance(
		currentProgress,
		currentIterationItem[direction > 0 ? "to" : "from"]
	);

	const distanceToTargetProgress = calculateDistance(currentProgress, targetProgress);

	const durationFactor =
		Math.abs(distanceToBound < 1 ? distanceToBound : 1 - distanceToTargetProgress) % 1 || 1;

	const nextIterationItem =
		distanceToTargetProgress > 1
			? ITERATIONS_CHAIN[ITERATIONS_CHAIN.indexOf(currentIterationItem) + direction] ||
			  currentIterationItem
			: currentIterationItem;

	const isCurrentIterationFinished = currentProgress >= currentIterationItem.to;

	const to = iterationsChain.getBoundPropByDirection(
		isCurrentIterationFinished ? nextIterationItem : currentIterationItem,
		targetProgress,
		direction
	);
	const duration = isCurrentIterationFinished
		? nextIterationItem.duration
		: currentIterationItem.duration;

	settedTargetProgress(targetProgress);

	if (!isBiggestDistance(distanceToTargetProgress)) {
		progress.start({
			to,
			config: {
				duration: duration * durationFactor,
			},
			onRest: () => runToProgress(targetProgress),
		});
	} else {
		progress.start({
			to: targetProgress,
			config: { duration: (distanceToTargetProgress / ITERATIONS_CHAIN.rightBound) * 2000 },
		});
	}
};

sample({
	clock: settedTargetProgress,
	source: $progress,
	fn: (progress, target) => ({ from: progress, to: target }),
	target: $settedProgressData,
});
