import { createContext, useCallback, useMemo, useRef } from "react";
import { Interpolation, SpringValue, useSpring } from "react-spring";

import { useLocalStore } from "@core/hooks";
import { clamp } from "@core/utils";

export type Context = {
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
	getTarget: () => number;
	iterations: number;
};

export interface Props extends React.PropsWithChildren<{}> {
	iterations: number;
}

export const IterationControls: React.FC<Props> = ({ children, iterations }) => {
	const targetRef = useRef(0);
	const localStore = useLocalStore<Context["store"]>({
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
		config: {
			tension: 280,
			friction: 80,
		},
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

	const setTarget = useCallback(
		(iteration: number) => {
			targetRef.current = clamp(iteration, 0, iterations);
		},
		[iterations]
	);

	const set = useCallback(
		(iteration: number) => {
			animatedProgressApi.set({ value: toProgress(iteration) });
			setTarget(iteration);
		},
		[animatedProgressApi, setTarget, toProgress]
	);

	const getTarget = useCallback(() => {
		return targetRef.current;
	}, []);

	const animate = useCallback(
		(iteration: number) => {
			animatedProgressApi.start({ value: toProgress(iteration) });
			setTarget(iteration);
		},
		[animatedProgressApi, setTarget, toProgress]
	);

	const contextStore = useMemo<Context>(
		() => ({
			animated: {
				progress: animatedProgress,
				inRange,
				toRange,
			},
			store: localStore,
			range: rangeImpl,
			iterations,
			getTarget,
			animate,
			set,
		}),
		[animate, animatedProgress, getTarget, inRange, iterations, localStore, set, toRange]
	);

	return <context.Provider value={contextStore}>{children}</context.Provider>;
};

export const context = createContext<Context>(null!);

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
