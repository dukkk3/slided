import { createContext, useCallback, useRef } from "react";

import { useSharedIterationsContextFactory, IterationsContext } from "@core/hooks";
import { clamp } from "@core/utils";

export interface Context extends IterationsContext {
	getTarget: () => number;
}

export interface Props extends React.PropsWithChildren<{}> {
	iterations: number;
}

export const IterationControls: React.FC<Props> = ({ children, iterations }) => {
	const targetRef = useRef(0);
	const iterationsContext = useSharedIterationsContextFactory({
		iterations,
		animationConfig: {
			tension: 280,
			friction: 80,
		},
	});

	const setTarget = useCallback(
		(iteration: number) => {
			targetRef.current = clamp(iteration, 0, iterations);
		},
		[iterations]
	);

	const set = useCallback(
		(iteration: number) => {
			iterationsContext.set(iteration);
			setTarget(iteration);
		},
		[iterationsContext, setTarget]
	);

	const animate = useCallback(
		(iteration: number) => {
			iterationsContext.animate(iteration);
			setTarget(iteration);
		},
		[iterationsContext, setTarget]
	);

	const getTarget = useCallback(() => {
		return targetRef.current;
	}, []);

	return (
		<context.Provider value={{ ...iterationsContext, set, animate, getTarget }}>
			{children}
		</context.Provider>
	);
};

export const context = createContext<Context>(null!);
