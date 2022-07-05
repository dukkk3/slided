import { createContext, useCallback, useEffect } from "react";
import { easings } from "react-spring";
import { reaction } from "mobx";

import {
	useIterationsContextFactory,
	IterationsContext,
} from "@core/hooks/useIterationsContextFactory";
import { useLocalStore } from "@core/hooks/useLocalStore";
import { clamp } from "@core/utils/math.utils";

interface RangeConfig {
	from: number;
	to: number;
	duration: number;
}

export interface Props extends React.PropsWithChildren<{}> {
	enabled?: boolean;
	iterations: number;
	defaultDuration?: number;
	stepBetweenIterations?: number;
}

export type Context = IterationsContext & {
	prev: () => void;
	next: () => void;
	change: (iteration: number) => void;
	getDurationFactorOnRange: (from: number, to: number) => number;
	enabled: boolean;
};

export const context = createContext<Context>(null!);

const RANGES: RangeConfig[] = [
	{ from: 9, to: 9.5, duration: 2000 },
	{ from: 4.5, to: 5, duration: 2500 },
	{ from: 7, to: 7.5, duration: 5000 },
];

export const IterationsControls: React.FC<Props> = ({
	children,
	iterations,
	enabled = true,
	defaultDuration = 1200,
	stepBetweenIterations = 0.5,
}) => {
	const localStore = useLocalStore({ iteration: 0 });
	const iterationsContext = useIterationsContextFactory({
		iterations,
		animationConfig: {
			duration: defaultDuration,
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
			return { ...(duration ? { duration } : { duration: defaultDuration }) };
		},
		[defaultDuration]
	);

	const getDurationFactorOnRange = useCallback(
		(from: number, to: number) => {
			const duration =
				RANGES.find((rangeConfig) => rangeConfig.from <= from && rangeConfig.to >= to)?.duration ||
				defaultDuration;
			return duration / defaultDuration;
		},
		[defaultDuration]
	);

	const handleAnimationRest = useCallback(() => {
		const { iteration } = iterationsContext.store;
		if (Math.abs(iteration - localStore.iteration) > 0) {
			const sign = Math.sign(iteration - localStore.iteration);
			const config = getCurrentRangeConfig(
				iterationsContext.store.iteration,
				sign === -1 ? "right" : "left"
			);
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
					const targetIteration = iteration + stepBetweenIterations * sign;
					const durationFactor =
						Math.abs(iterationsContext.store.iteration - targetIteration) / stepBetweenIterations;
					const config = getCurrentRangeConfig(targetIteration, sign === -1 ? "left" : "right");
					iterationsContext.animate(targetIteration, {
						...config,
						duration: config.duration * clamp(durationFactor, 0, 1),
					});
					// duration: DURATION * clamp(durationFactor, 0, 1),
				}
			),
		[getCurrentRangeConfig, iterationsContext, stepBetweenIterations, localStore]
	);

	useEffect(() => {
		document.addEventListener("keydown", handleDocumentKeyDown);

		return () => {
			document.removeEventListener("keydown", handleDocumentKeyDown);
		};
	}, [handleDocumentKeyDown]);

	return (
		<context.Provider
			value={{ ...iterationsContext, prev, next, change, getDurationFactorOnRange, enabled }}>
			{children}
		</context.Provider>
	);
};
