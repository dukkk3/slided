import { createContext, useCallback, useEffect, useRef } from "react";
import { useWheel } from "@use-gesture/react";
import { reaction } from "mobx";

import { useIterationContextFactory, IterationContext, useLocalStore } from "@core/hooks";
import { clamp } from "@core/utils";

export interface Props extends React.PropsWithChildren<{}> {
	iterations: number;
	enabled?: boolean;
}

export type Context = IterationContext & {
	prev: () => void;
	next: () => void;
	footerRef: React.Ref<any>;
};

export const IterationControls: React.FC<Props> = ({ children, iterations, enabled = true }) => {
	const localStore = useLocalStore({ iteration: 0 });
	const footerRef = useRef<HTMLDivElement>(null);
	const iterationContext = useIterationContextFactory({
		iterations,
		animationConfig: { tension: 160, friction: 140, mass: 1.15 },
	});

	const next = useCallback(() => {
		const { iteration } = localStore;
		const nextIteration = clamp(iteration + 1, 0, iterations);
		localStore.setIteration(nextIteration);
	}, [iterations, localStore]);

	const prev = useCallback(() => {
		const { iteration } = localStore;
		const nextIteration = clamp(iteration - 1, 0, iterations);
		localStore.setIteration(nextIteration);
	}, [iterations, localStore]);

	const change = useCallback(
		(iteration: number) => {
			const nextIteration = clamp(iteration, 0, iterations);
			localStore.setIteration(nextIteration);
		},
		[iterations, localStore]
	);

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

			const footer = footerRef.current;
			const startFlag =
				!wheeling ||
				elapsedTime > 400 ||
				(iterationContext.store.iteration === iterations &&
					footer &&
					footer.scrollTop === 0 &&
					my < -100);

			if (iterationContext.store.iteration === iterations && footer && footer.scrollTop > 0) {
				return null;
			}

			if (startFlag && typeof memo !== "number") return null;
			if (startFlag && typeof memo === "number") {
				const lastDirection = memo as number;

				if (lastDirection === 0) return null;

				if (lastDirection < 0) {
					prev();
					return null;
				} else {
					next();
					return null;
				}
			}

			return dy;
		},
		{ target: window, axis: "y" }
	);

	useEffect(
		() =>
			reaction(
				() => localStore.iteration,
				(iteration) => iterationContext.animate(iteration)
			),
		[iterationContext, localStore]
	);

	useEffect(() => {
		document.addEventListener("keydown", handleDocumentKeyDown);

		return () => {
			document.removeEventListener("keydown", handleDocumentKeyDown);
		};
	}, [handleDocumentKeyDown]);

	return (
		<context.Provider value={{ ...iterationContext, footerRef, prev, next }}>
			{children}
		</context.Provider>
	);
};

export const context = createContext<Context>(null!);
