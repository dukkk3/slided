import { useCallback } from "react";
import { Interpolation, SpringValue, SpringConfig, useSpring } from "react-spring";

import { useLocalStore } from "@core/hooks";
import { clamp } from "@core/utils";

interface Options {
	iterations: number;
	animationConfig?: SpringConfig;
}

export interface IterationsContext {
	animated: {
		progress: SpringValue<number>;
		toRange: (a: number, b: number) => Interpolation<number, number>;
		inRange: (a: number, b?: number) => boolean;
	};
	store: {
		progress: number;
		compare: (a: number, type: CompareKind) => boolean;
		inRange: (a: number, b?: number) => boolean;
		toRange: (a: number, b: number) => number;
	};
	range: (value: number, a: number, b: number) => number;
	animate: (iteration: number) => void;
	set: (iteration: number) => void;
	iterations: number;
}

export function useSharedIterationsContextFactory({
	iterations,
	animationConfig,
}: Options): IterationsContext {
	const localStore = useLocalStore<IterationsContext["store"]>({
		progress: 0,
		inRange: function (a: number, b?: number) {
			return inRangeImpl(iterations, this.progress, a, b);
		},
		toRange: function (a: number, b: number) {
			return rangeImpl(this.progress * iterations, a, b);
		},
		compare: function (a: number, type: CompareKind) {
			return compareImpl(this.progress * iterations, a, type);
		},
	});
	const [{ value: animatedProgress }, animatedProgressApi] = useSpring(() => ({
		value: 0,
		config: animationConfig,
		onChange: {
			value: (value: number) => {
				localStore.setProgress(value);
			},
		},
	}));

	const inRange = useCallback(
		(a: number, b?: number) => {
			return inRangeImpl(iterations, animatedProgress.get(), a, b);
		},
		[animatedProgress, iterations]
	);

	const toRange = useCallback(
		(a: number, b: number) => {
			return animatedProgress.to((value) => value * iterations).to((value) => rangeImpl(value, a, b));
		},
		[animatedProgress, iterations]
	);

	const toProgress = useCallback(
		(iteration: number) => {
			return clamp(iteration, 0, iterations) / iterations;
		},
		[iterations]
	);

	const set = useCallback(
		(iteration: number) => {
			animatedProgressApi.set({ value: toProgress(iteration) });
		},
		[animatedProgressApi, toProgress]
	);

	const animate = useCallback(
		(iteration: number) => {
			animatedProgressApi.start({ value: toProgress(iteration) });
		},
		[animatedProgressApi, toProgress]
	);

	return {
		animated: {
			progress: animatedProgress,
			inRange,
			toRange,
		},
		store: localStore,
		range: rangeImpl,
		iterations,
		animate,
		set,
	};
}

function inRangeImpl(iterations: number, progress: number, a: number, b?: number) {
	const currentIteration = iterations * progress;

	if (!b) {
		return Math.floor(currentIteration) === a;
	}

	return currentIteration >= a && currentIteration < b;
}

function rangeImpl(value: number, a: number, b: number) {
	return value < a ? 0 : value >= b ? 1 : (value - a) / (b - a);
}

type CompareKind = "gte" | "gt" | "lt" | "lte";

function compareImpl(value: number, a: number, type: CompareKind) {
	switch (type) {
		case "gt":
			return a > value;
		case "gte":
			return a >= value;
		case "lt":
			return a < value;
		case "lte":
			return a <= value;
	}
}
