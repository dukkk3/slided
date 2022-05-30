import { useCallback, useMemo, useRef } from "react";
import { Interpolation, SpringValue, SpringConfig, useSpring } from "react-spring";

import { useLocalStore } from "@core/hooks";
import { clamp } from "@core/utils";

interface Options {
	iterations: number;
	animationConfig?: SpringConfig;
	animationConfigLinear?: SpringConfig;
}

type Listener<T extends any[] = never[]> = (...args: T) => void;
type Listeners = {
	change: Set<Listener<[number]>>;
	rest: Set<Listener>;
};

export interface IterationsContext {
	animated: {
		progress: SpringValue<number>;
		toRange: (a: number, b: number) => Interpolation<number, number>;
		inRange: (a: number, b?: number) => boolean;
	};
	store: {
		progress: number;
		readonly iteration: number;
		compare: (a: number, type: CompareKind) => boolean;
		inRange: (a: number, b?: number) => boolean;
		toRange: (a: number, b: number) => number;
	};
	storeLinear: {
		progress: number;
		inRange: (a: number, b?: number) => boolean;
		toRange: (a: number, b: number) => number;
	};
	range: (value: number, a: number, b: number) => number;
	animate: (iteration: number) => void;
	set: (iteration: number) => void;
	addListener: <T extends keyof Listeners>(
		type: T,
		listener: Listeners[T] extends Set<infer R> ? R : never
	) => () => void;
	removeListener: <T extends keyof Listeners>(
		type: T,
		listener: Listeners[T] extends Set<infer R> ? R : never
	) => void;
	iterations: number;
}

export function useSharedIterationsContextFactory({
	iterations,
	animationConfig,
	animationConfigLinear,
}: Options): IterationsContext {
	const listeners = useMemo<Listeners>(
		() => ({ change: new Set<Listener<[number]>>(), rest: new Set<Listener>() }),
		[]
	);
	const targetRef = useRef(0);
	const localStore = useLocalStore<IterationsContext["store"]>({
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
		compare: function (a: number, type: CompareKind) {
			return compareImpl(this.progress * iterations, a, type);
		},
	});
	const localStoreLinear = useLocalStore<IterationsContext["storeLinear"]>({
		progress: 0,
		inRange: function (a: number, b?: number) {
			return inRangeImpl(iterations, this.progress, a, b);
		},
		toRange: function (a: number, b: number) {
			return rangeImpl(this.progress * iterations, a, b);
		},
	});
	const [{ value: animatedProgressLinear }, animatedProgressLinearApi] = useSpring(() => ({
		value: 0,
		config: animationConfigLinear,
		onChange: {
			value: (value: number) => {
				localStoreLinear.setProgress(value);
			},
		},
	}));
	const [{ value: animatedProgress }, animatedProgressApi] = useSpring(() => ({
		value: 0,
		config: animationConfig,
		onChange: {
			value: (value: number) => {
				localStore.setProgress(value);
				listeners.change.forEach((listener) => listener(value));
			},
		},
		onRest: {
			value: (payload) => {
				if (payload.finished) {
					listeners.rest.forEach((listener) => listener());
				}
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
			animatedProgressLinearApi.set({ value: progress });
		},
		[animatedProgressApi, animatedProgressLinearApi, toProgress]
	);

	const animate = useCallback(
		(iteration: number) => {
			if (iteration === targetRef.current) return;
			let config: SpringConfig | undefined;
			const progress = toProgress(iteration);

			// if (animationConfig?.duration) {
			// 	const delta = Math.abs(localStore.progress - progress);
			// 	const duration = animationConfig.duration * iterations * delta;
			// 	config = { ...animationConfig, duration };
			// }
			// console.log({ delta, duration, a: animationConfig?.duration });
			animatedProgressApi.start({ value: progress, config });
			animatedProgressLinearApi.start({ value: progress, config });
			targetRef.current = iteration;
		},
		[
			animatedProgressApi,
			animatedProgressLinearApi,
			animationConfig,
			iterations,
			localStore.progress,
			toProgress,
		]
	);

	const removeListener = useCallback(
		<T extends keyof Listeners>(type: T, listener: Listeners[T] extends Set<infer R> ? R : never) => {
			listeners[type].delete(listener as any);
		},
		[listeners]
	);

	const addListener = useCallback(
		<T extends keyof Listeners>(type: T, listener: Listeners[T] extends Set<infer R> ? R : never) => {
			listeners[type].add(listener as any);
			return () => removeListener(type, listener);
		},
		[listeners, removeListener]
	);

	return {
		animated: {
			progress: animatedProgress,
			inRange,
			toRange,
		},
		storeLinear: localStoreLinear,
		store: localStore,
		range: rangeImpl,
		iterations,
		animate,
		removeListener,
		addListener,
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
