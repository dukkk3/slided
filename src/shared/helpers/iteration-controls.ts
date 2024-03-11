import { combine, createStore, createEvent, sample, Store } from "effector";
import { SpringValue } from "@react-spring/web";
import { previous } from "patronum";

import { IterationsChain, findItem, getBoundPropByDirection } from "./iterations-chain";
import { math } from "../utils";

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

export const create = ({ iterationsChain }: { iterationsChain: IterationsChain }) => {
	const progress = new SpringValue(0, {
		onChange: (value) => settedProgress(value as unknown as number),
	});

	const settedProgress = createEvent<number>();
	const settedTargetProgress = createEvent<number>();

	const $progress = createStore(progress.get());
	const $previousProgress = previous($progress, 0);
	const $settedProgressData = createStore<{ from: number; to: number }>({
		from: 0,
		to: 0,
	});

	const $smoothedDistanceOfBiggestStep = combine(
		{ progress: $progress, settedProgress: $settedProgressData },
		({ progress, settedProgress }) => calculateDistanceOfStep(progress, settedProgress)
	);

	const smoothedDistanceOfBiggestStep = progress.to((value) =>
		calculateDistanceOfStep(value, $settedProgressData.getState())
	);

	const $iterationRunDirection = combine(
		{ progress: $progress, previousProgress: $previousProgress },
		({ progress, previousProgress }) => Math.sign(progress - previousProgress)
	);

	const $currentIterationIndex = combine(
		{ progress: $progress, iterationRunDirection: $iterationRunDirection },
		({ progress, iterationRunDirection }) => {
			const iterationItem = findItem(iterationsChain, progress, iterationRunDirection);
			return iterationsChain.indexOf(iterationItem);
		}
	);

	const runToIteration = (index: number, toEnd?: boolean) => {
		if (index < 0 || index >= iterationsChain.length) return;
		runToProgress(iterationsChain[index][toEnd ? "to" : "from"]);
	};

	const slideIteration = (direction: number, toEnd?: boolean) => {
		const currentIterationIndex = $currentIterationIndex.getState();
		runToIteration(currentIterationIndex + direction, toEnd);
	};

	const runToProgress = (targetProgress: number) => {
		const currentProgress = $progress.getState();
		const direction = Math.sign(targetProgress - currentProgress);

		if (direction === 0) return;

		progress.stop();

		const currentIterationItem = findItem(iterationsChain, currentProgress, direction);

		const distanceToBound = calculateDistance(
			currentProgress,
			currentIterationItem[direction > 0 ? "to" : "from"]
		);

		const distanceToTargetProgress = calculateDistance(currentProgress, targetProgress);

		const durationFactor =
			Math.abs(distanceToBound < 1 ? distanceToBound : 1 - distanceToTargetProgress) % 1 || 1;

		const nextIterationItem =
			distanceToTargetProgress > 1
				? iterationsChain[iterationsChain.indexOf(currentIterationItem) + direction] ||
				  currentIterationItem
				: currentIterationItem;

		const isCurrentIterationFinished = currentProgress >= currentIterationItem.to;

		const to = getBoundPropByDirection(
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
				config: { duration: (distanceToTargetProgress / iterationsChain.rightBound) * 2000 },
			});
		}
	};

	sample({
		clock: settedTargetProgress,
		source: $progress,
		fn: (progress, target) => ({ from: progress, to: target }),
		target: $settedProgressData,
	});

	sample({
		clock: settedProgress,
		target: $progress,
	});

	return {
		progress,
		$progress,
		$previousProgress,
		$smoothedDistanceOfBiggestStep,
		smoothedDistanceOfBiggestStep,
		$iterationRunDirection,
		$currentIterationIndex,
		runToIteration,
		runToProgress,
		slideIteration,
	};
};
