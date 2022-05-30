import { createContext, useCallback, useEffect, useLayoutEffect, useMemo } from "react";
import { easings, Interpolation } from "react-spring";
import { reaction } from "mobx";
import useRefs from "react-use-refs";

import {
	useQueryParams,
	useResizeObserver,
	IterationsContext,
	useSharedIterationsContextFactory,
} from "@core/hooks";
import { clamp } from "@core/utils";

import * as S from "./styled";

export type Context = IterationsContext & {
	animated: IterationsContext["animated"] & { scrollTop: Interpolation<number, number> };
};

export interface Props {
	pages: number;
	enabled?: boolean;
	children?: React.ReactNode;
}

export const ScrollControls: React.FC<Props> = ({ children, pages, enabled = true }) => {
	const [containerRef, fixedRef, fillRef, contentRef] = useRefs<HTMLDivElement>(null);
	const containerResizeObserver = useResizeObserver({ ref: containerRef });
	const contentResizeObserver = useResizeObserver({ ref: contentRef });
	const queryParams = useQueryParams();
	const fixedIteration = useMemo(() => queryParams.get("type") === "fixed", [queryParams]);
	const iterationsContext = useSharedIterationsContextFactory({
		iterations: pages,
		animationConfig: false
			? {
					duration: 2000,
					easing: easings.linear,
			  }
			: { tension: 260, friction: 120, mass: 0.85 },
		animationConfigLinear: fixedIteration
			? {
					easing: easings.linear,
					duration: 2000,
			  }
			: { tension: 220, friction: 80, mass: 0.5 },
	});

	const scrollTop = iterationsContext.animated.progress.to((value) => {
		const containerHeight = containerResizeObserver.getSize().height;
		const y = -(value * (pages - 1)) * containerHeight;
		return y;
	});

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
		// const iteration = Math.round(progress * pages);
		const iteration = fixedIteration ? Math.floor(progress * pages) : progress * pages;

		iterationsContext.animate(iteration);
	}, [calculateProgress, containerRef, enabled, iterationsContext, pages, fixedIteration]);

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

					iterationsContext.animate(progress * pages);
				}
			),
		[
			containerResizeObserver,
			contentResizeObserver,
			iterationsContext,
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
						value={{ ...iterationsContext, animated: { ...iterationsContext.animated, scrollTop } }}>
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
