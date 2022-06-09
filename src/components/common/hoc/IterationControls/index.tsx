import { createContext, useCallback, useEffect } from "react";
import { easings } from "react-spring";
import { useWheel } from "@use-gesture/react";
import { reaction } from "mobx";

import { useIterationsContextFactory, IterationsContext, useLocalStore } from "@core/hooks";
import { clamp } from "@core/utils";

interface RangeConfig {
	from: number;
	to: number;
	duration: number;
}

export interface Props extends React.PropsWithChildren<{}> {
	enabled?: boolean;
	iterations: number;
}

export type Context = IterationsContext & {
	prev: () => void;
	next: () => void;
	change: (iteration: number) => void;
	getDurationFactorOnRange: (from: number, to: number) => number;
};

const STEP = 0.5;
const DURATION = 1200;

const RANGES: RangeConfig[] = [
	{ from: 9, to: 9.5, duration: 2000 },
	{ from: 4.5, to: 5, duration: 2500 },
];

export const IterationControls: React.FC<Props> = ({ children, iterations, enabled = true }) => {
	const localStore = useLocalStore({ iteration: 0 });
	const iterationsContext = useIterationsContextFactory({
		iterations,
		animationConfig: {
			duration: DURATION,
			easing: easings.linear,
		},
	});

	const change = useCallback(
		(iteration: number) => {
			const nextIteration = clamp(iteration, 0, iterations);
			localStore.setIteration(nextIteration);
		},
		[iterations, localStore]
	);

	const next = useCallback(() => {
		change(localStore.iteration + 1);
	}, [change, localStore]);

	const prev = useCallback(() => {
		change(localStore.iteration - 1);
	}, [change, localStore]);

	const handleDocumentKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (!enabled) return;

			switch (event.key) {
				case "ArrowDown":
					return next();
				case "ArrowUp":
					return prev();
			}
		},
		[enabled, next, prev]
	);

	const getCurrentRangeConfig = useCallback(
		(iteration: number, bound: "left" | "right" = "left") => {
			const { duration } =
				RANGES.find(
					(rangeConfig) =>
						(bound === "left" ? rangeConfig.from < iteration : rangeConfig.from <= iteration) &&
						(bound === "right" ? rangeConfig.to > iteration : rangeConfig.to >= iteration)
				) || {};
			return { ...(duration ? { duration } : { duration: DURATION }) };
		},
		[]
	);

	const getDurationFactorOnRange = useCallback((from: number, to: number) => {
		const duration =
			RANGES.find((rangeConfig) => rangeConfig.from <= from && rangeConfig.to >= to)?.duration ||
			DURATION;
		return duration / DURATION;
	}, []);

	useWheel(
		({ wheeling, direction: [, dy], memo, elapsedTime, movement: [, my] }) => {
			if (!enabled) return;

			const swapEnabled = !wheeling || elapsedTime > 400;
			const memoIsNumber = typeof memo === "number";

			if (swapEnabled && !memoIsNumber) return null;
			if (swapEnabled && memoIsNumber) {
				const direction = memo as number;

				switch (direction) {
					case 1:
						next();
						break;
					case -1:
						prev();
						break;
				}

				return null;
			}

			return dy;
		},
		{ target: window, axis: "y" }
	);

	const handleAnimationRest = useCallback(() => {
		const { iteration } = iterationsContext.store;
		if (Math.abs(iteration - localStore.iteration) > 0) {
			const sign = Math.sign(iteration - localStore.iteration);
			const config = getCurrentRangeConfig(
				iterationsContext.store.iteration,
				sign === -1 ? "right" : "left"
			);
			console.log("CONTINUE DURATION:", config.duration);
			iterationsContext.animate(localStore.iteration, config);
		}
	}, [getCurrentRangeConfig, iterationsContext, localStore]);

	useEffect(
		() => iterationsContext.addEventListener("rest", handleAnimationRest),
		[handleAnimationRest, iterationsContext]
	);

	useEffect(
		() =>
			reaction(
				() => localStore.iteration,
				(iteration) => {
					const sign = Math.sign(iterationsContext.store.iteration - localStore.iteration);
					const targetIteration = iteration + STEP * sign;
					// const durationFactor = Math.abs(iterationsContext.store.iteration - targetIteration) / STEP;
					const config = getCurrentRangeConfig(targetIteration, sign === -1 ? "left" : "right");
					console.log("START DURATION:", config.duration);
					iterationsContext.animate(targetIteration, config);
					// duration: DURATION * clamp(durationFactor, 0, 1),
				}
			),
		[getCurrentRangeConfig, iterationsContext, localStore]
	);

	useEffect(() => {
		document.addEventListener("keydown", handleDocumentKeyDown);

		return () => {
			document.removeEventListener("keydown", handleDocumentKeyDown);
		};
	}, [handleDocumentKeyDown]);

	return (
		<context.Provider value={{ ...iterationsContext, prev, next, change, getDurationFactorOnRange }}>
			{children}
		</context.Provider>
	);
};

export const context = createContext<Context>(null!);
