import { useCallback, useRef } from "react";
import { Interpolation, SpringValue, SpringConfig, useSpring } from "react-spring";

import { useLocalStore } from "@core/hooks";
import { clamp } from "@core/utils";

interface Options {
	iterations: number;
	animationConfig: SpringConfig;
}

export interface IterationContext {
	animated: {
		progress: SpringValue<number>;
		toRange: (a: number, b: number) => Interpolation<number, number>;
		inRange: (a: number, b?: number) => boolean;
	};
	store: {
		progress: number;
		readonly iteration: number;
		compare: (a: number, operator: CompareOperatorKind) => boolean;
		inRange: (a: number, b?: number) => boolean;
		toRange: (a: number, b: number) => number;
	};
	toRange: (value: number, a: number, b: number) => number;
	animate: (iteration: number) => void;
	set: (iteration: number) => void;
	iterations: number;
}

export function useIterationContextFactory({
	iterations,
	animationConfig,
}: Options): IterationContext {
	const targetRef = useRef(0);
	const localStore = useLocalStore<IterationContext["store"]>({
		progress: 0,
		get iteration() {
			return this.progress * iterations;
		},
		inRange: function (a: number, b?: number) {
			return inRangeImpl(iterations, this.progress, a, b);
		},
		toRange: function (a: number, b: number) {
			return rangeImpl(this.progress * iterations, a, b);
		},
		compare: function (a: number, operator: CompareOperatorKind) {
			return compareImpl(this.progress * iterations, a, operator);
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
			const progress = toProgress(iteration);
			animatedProgressApi.set({ value: progress });
		},
		[animatedProgressApi, toProgress]
	);

	const animate = useCallback(
		(iteration: number, config?: SpringConfig) => {
			if (iteration === targetRef.current) return;
			const progress = toProgress(iteration);
			animatedProgressApi.start({ value: progress, config });
			targetRef.current = iteration;
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
		toRange: rangeImpl,
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

type CompareOperatorKind = "gte" | "gt" | "lt" | "lte";

function compareImpl(value: number, a: number, operator: CompareOperatorKind) {
	switch (operator) {
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
