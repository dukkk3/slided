import { createContext, useCallback, useEffect } from "react";
import { useWheel } from "@use-gesture/react";
import { easings } from "react-spring";
import { reaction } from "mobx";

import { useIterationsContextFactory, IterationsContext, useLocalStore } from "@core/hooks";
import { clamp } from "@core/utils";

export interface Props extends React.PropsWithChildren<{}> {
	enabled?: boolean;
	iterations: number;
}

export type Context = IterationsContext & {
	prev: () => void;
	next: () => void;
	change: (iteration: number) => void;
};

const STEP = 0.5;
const DURATION = 1150;

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
		if (Math.abs(iterationsContext.store.iteration - localStore.iteration) > 0) {
			iterationsContext.animate(localStore.iteration);
		}
	}, [iterationsContext, localStore]);

	useEffect(
		() => iterationsContext.addEventListener("rest", handleAnimationRest),
		[handleAnimationRest, iterationsContext]
	);

	useEffect(
		() =>
			reaction(
				() => localStore.iteration,
				(iteration) => {
					const targetIteration =
						iteration + STEP * Math.sign(iterationsContext.store.iteration - localStore.iteration);
					const durationFactor = Math.abs(iterationsContext.store.iteration - targetIteration) / STEP;
					iterationsContext.animate(targetIteration, {
						duration: DURATION * clamp(durationFactor, 0, 1),
					});
				}
			),
		[iterationsContext, localStore]
	);

	useEffect(() => {
		document.addEventListener("keydown", handleDocumentKeyDown);

		return () => {
			document.removeEventListener("keydown", handleDocumentKeyDown);
		};
	}, [handleDocumentKeyDown]);

	return (
		<context.Provider value={{ ...iterationsContext, prev, next, change }}>
			{children}
		</context.Provider>
	);
};

export const context = createContext<Context>(null!);
