import { createContext, useCallback, useEffect, useLayoutEffect } from "react";
import { Interpolation } from "react-spring";
import { reaction } from "mobx";
import useRefs from "react-use-refs";

import {
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
	const iterationsContext = useSharedIterationsContextFactory({
		iterations: pages,
		animationConfig: {
			tension: 280,
			friction: 80,
		},
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

		iterationsContext.animate(progress * pages);
	}, [calculateProgress, containerRef, enabled, iterationsContext, pages]);

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
				<S.Fill ref={fillRef} style={{ height: `${pages * 100}vh` }} />
			</S.Container>
		</S.ScrollControls>
	);
};

export const context = createContext<Context>(null!);
