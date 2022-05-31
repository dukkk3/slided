import { createContext, useCallback, useEffect, useLayoutEffect } from "react";
import { easings, Interpolation } from "react-spring";
import { reaction } from "mobx";
import useRefs from "react-use-refs";

import {
	useResizeObserver,
	IterationControlsContext,
	useIterationControlsContext,
} from "@core/hooks";
import { clamp } from "@core/utils";

import * as S from "./styled";

export type Context = IterationControlsContext & {
	animated: IterationControlsContext["animated"] & { scrollTop: Interpolation<number, number> };
};

export interface Props extends React.PropsWithChildren<{}> {
	pages: number;
	enabled?: boolean;
	fixedAnimation?: boolean;
}

export const ScrollControls: React.FC<Props> = ({
	pages,
	children,
	enabled = true,
	fixedAnimation = false,
}) => {
	const [containerRef, fixedRef, fillRef, contentRef] = useRefs<HTMLDivElement>(null);
	const containerResizeObserver = useResizeObserver({ ref: containerRef });
	const contentResizeObserver = useResizeObserver({ ref: contentRef });
	const iterationControlsContext = useIterationControlsContext({
		iterations: pages,
		animationConfig: { tension: 260, friction: 120, mass: 0.85 },
		animationConfigLinear: fixedAnimation
			? {
					easing: easings.linear,
					duration: 2000,
			  }
			: { tension: 260, friction: 120, mass: 0.85 },
	});

	const scrollTop = iterationControlsContext.animated.progress.to((value) => {
		const containerHeight = containerResizeObserver.getSize().height;
		const y = -(value * (pages - 1)) * containerHeight;
		return y;
	});

	const calculateIteration = useCallback(
		(progress: number) => {
			const iteration = iterationControlsContext.iterations * progress;
			return fixedAnimation ? Math.floor(iteration) : iteration;
		},
		[fixedAnimation, iterationControlsContext]
	);

	const calculateProgress = useCallback(
		(scrollTop: number, scrollHeight: number) => {
			const containerHeight = containerResizeObserver.getSize().height;
			const progress = scrollTop / Math.max(0.0001, scrollHeight - containerHeight);
			return clamp(progress, 0, 1);
		},
		[containerResizeObserver]
	);

	const handleScroll = useCallback(() => {
		if (!enabled) {
			return;
		}

		const container = containerRef.current!;
		const { scrollTop, scrollHeight } = container;
		const progress = calculateProgress(scrollTop, scrollHeight);
		const iteration = calculateIteration(progress);

		iterationControlsContext.animate(iteration);
	}, [enabled, containerRef, calculateProgress, calculateIteration, iterationControlsContext]);

	const scrollTo = useCallback(
		(y: number) => {
			const container = containerRef.current;

			if (!container) return;

			container.scrollTop = clamp(y, 0, container.scrollHeight);
		},
		[containerRef]
	);

	useEffect(
		() =>
			reaction(
				() => [containerResizeObserver.getSize().height, contentResizeObserver.getSize().height],
				() => {
					const container = containerRef.current!;
					const { scrollTop, scrollHeight } = container;
					const progress = calculateProgress(scrollTop, scrollHeight);
					const iteration = calculateIteration(progress);

					iterationControlsContext.set(iteration);
				}
			),
		[
			iterationControlsContext,
			containerResizeObserver,
			contentResizeObserver,
			calculateIteration,
			calculateProgress,
			containerRef,
			pages,
		]
	);

	useLayoutEffect(() => {
		const container = containerRef.current!;
		scrollTo(1);
		container.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			container.removeEventListener("scroll", handleScroll);
		};
	}, [containerRef, handleScroll, scrollTo]);

	return (
		<S.ScrollControls>
			<S.Container ref={containerRef} style={{ overflow: enabled ? "hidden auto" : "hidden" }}>
				<S.Fixed ref={fixedRef}>
					<context.Provider
						value={{
							...iterationControlsContext,
							animated: { ...iterationControlsContext.animated, scrollTop },
						}}>
						<S.Content
							ref={contentRef}
							style={{
								y: scrollTop,
							}}>
							{children}
						</S.Content>
					</context.Provider>
				</S.Fixed>
				<S.Fill ref={fillRef} style={{ height: `${pages * 200}vh` }} />
			</S.Container>
		</S.ScrollControls>
	);
};

export const context = createContext<Context>(null!);
