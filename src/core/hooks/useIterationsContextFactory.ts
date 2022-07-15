import { useCallback, useMemo, useRef } from "react";
import { Interpolation, SpringValue, SpringConfig, useSpring } from "react-spring";

import { useLocalStore } from "./useLocalStore";
import {
	clamp,
	toRange as toRangeImpl,
	inRange as inRangeImpl,
	compare as compareImpl,
	CompareOperatorKind,
} from "@core/utils/math.utils";
import { resolveSpringAnimation } from "@core/helpers/animation.helper";

export interface Options {
	iterations: number;
	animationConfig?: SpringConfig;
}

export type Listener<T extends any[] = never[]> = (...args: T) => void;

export type Events = {
	rest: Listener;
	change: Listener<[number]>;
};

export interface Context {
	animated: {
		progress: SpringValue<number>;
		compare: (a: number, operator: CompareOperatorKind) => Interpolation<number, boolean>;
		toRange: (a: number, b: number) => Interpolation<number, number>;
		inRange: (a: number, b?: number) => Interpolation<number, boolean>;
	};
	store: {
		progress: number;
		readonly iteration: number;
		compare: (a: number, operator: CompareOperatorKind) => boolean;
		inRange: (a: number, b?: number) => boolean;
		toRange: (a: number, b: number) => number;
	};
	animate: (iteration: number, config?: SpringConfig) => void;
	set: (iteration: number) => void;
	addEventListener: <T extends keyof Events>(event: T, listener: Events[T]) => () => void;
	removeEventListener: <T extends keyof Events>(event: T, listener: Events[T]) => void;
	iterations: number;
}

export function useIterationsControlsContextFactory({
	iterations,
	animationConfig,
}: Options): Context {
	const targetRef = useRef(0);
	const listeners = useMemo<{
		[K in keyof Events]: Set<Events[K]>;
	}>(() => ({ rest: new Set(), change: new Set() }), []);
	const localStore = useLocalStore<Context["store"]>({
		progress: 0,
		get iteration() {
			return this.progress * iterations;
		},
		inRange: function (a: number, b?: number) {
			return inRangeImpl(this.progress * iterations, a, b);
		},
		toRange: function (a: number, b: number) {
			return toRangeImpl(this.progress * iterations, a, b);
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
				listeners.change.forEach((listener) => listener(value));
			},
		},
		onRest: {
			value: (state) => {
				if (state.finished) {
					listeners.rest.forEach((listener) => listener());
				}
			},
		},
	}));

	const inRange = useCallback(
		(a: number, b?: number) => {
			return animatedProgress.to((value) => inRangeImpl(iterations * value, a, b));
		},
		[animatedProgress, iterations]
	);

	const compare = useCallback(
		(a: number, operator: CompareOperatorKind) => {
			return animatedProgress.to((value) => compareImpl(value * iterations, a, operator));
		},
		[animatedProgress, iterations]
	);

	const toRange = useCallback(
		(a: number, b: number) => {
			return animatedProgress
				.to((value) => value * iterations)
				.to((value) => toRangeImpl(value, a, b));
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
			localStore.setProgress(progress);
		},
		[animatedProgressApi, localStore, toProgress]
	);

	const removeEventListener = useCallback(
		<T extends keyof Events>(event: T, listener: Events[T]) => {
			listeners[event].delete(listener);
		},
		[listeners]
	);

	const addEventListener = useCallback(
		<T extends keyof Events>(event: T, listener: Events[T]) => {
			listeners[event].add(listener);

			return () => removeEventListener(event, listener);
		},
		[listeners, removeEventListener]
	);

	const animate = useCallback(
		(iteration: number, config?: SpringConfig) => {
			if (iteration === targetRef.current) return;
			const progress = toProgress(iteration);
			targetRef.current = iteration;
			return resolveSpringAnimation(animatedProgressApi, { value: progress, config });
		},
		[animatedProgressApi, toProgress]
	);

	return {
		animated: {
			progress: animatedProgress,
			inRange,
			toRange,
			compare,
		},
		removeEventListener,
		store: localStore,
		addEventListener,
		iterations,
		animate,
		set,
	};
}
