import { createContext, useCallback, useEffect, useLayoutEffect, useMemo } from "react";
import { MotionValue, useMotionValue, useTransform } from "framer-motion";
import { SpringValue, useSpring } from "react-spring";
import { reaction } from "mobx";
import useRefs from "react-use-refs";

import { useLocalStore, useResizeObserver } from "@core/hooks";
import { clamp } from "@core/utils";

import * as S from "./styled";

type ContextHelpers = {
	range: (from: number, distance: number, margin?: number) => number;
	curve: (from: number, distance: number, margin?: number) => number;
	visible: (from: number, distance: number, margin?: number) => boolean;
};

export interface Context {
	store: {
		pages: number;
		progress: number;
		containerHeight: number;
		pixelAsProgress: number;
	} & ContextHelpers;
	animated: { _progress: SpringValue; progress: MotionValue<number> } & ContextHelpers;
	enabled: boolean;
}

export interface Props {
	enabled?: boolean;
	children?: React.ReactNode;
}

export const ScrollControls: React.FC<Props> = ({ children, enabled = true }) => {
	const [containerRef, fixedRef, fillRef, contentRef] = useRefs<HTMLDivElement>(null);
	const scrollAnimation = useMotionValue(0);
	const containerResizeObserver = useResizeObserver({ ref: containerRef });
	const contentResizeObserver = useResizeObserver({ ref: contentRef });
	const localStore = useLocalStore<Context["store"]>({
		pages: 0,
		progress: 0,
		containerHeight: 0,
		pixelAsProgress: 0,
		range: function (from: number, distance: number, margin?: number) {
			return rangeImpl(this.progress, from, distance, margin);
		},
		curve: function (from: number, distance: number, margin?: number) {
			return curveImpl(this.progress, from, distance, margin);
		},
		visible: function (from: number, distance: number, margin?: number) {
			return visibleImpl(this.progress, from, distance, margin);
		},
	});

	const [{ value: springScrollAnimation }, springScrollAnimationApi] = useSpring(() => ({
		value: 0,
		onChange: {
			value: (value: number) => {
				scrollAnimation.set(value);
				localStore.setProgress(value);
			},
		},
	}));

	const containerYTranslate = useTransform(scrollAnimation, (value) => {
		const containerHeight = containerResizeObserver.getSize().height;
		const y = -(value * (localStore.pages - 1)) * containerHeight;
		return y;
	});

	const visible = useCallback(
		(from: number, distance: number, margin?: number) => {
			return visibleImpl(scrollAnimation.get(), from, distance, margin);
		},
		[scrollAnimation]
	);

	const range = useCallback(
		(from: number, distance: number, margin?: number) => {
			return rangeImpl(scrollAnimation.get(), from, distance, margin);
		},
		[scrollAnimation]
	);

	const curve = useCallback(
		(from: number, distance: number, margin?: number) => {
			return curveImpl(scrollAnimation.get(), from, distance, margin);
		},
		[scrollAnimation]
	);

	const contextStore = useMemo<Context>(
		() => ({
			animated: { _progress: springScrollAnimation, progress: scrollAnimation, curve, range, visible },
			store: localStore,
			enabled,
		}),
		[springScrollAnimation, scrollAnimation, curve, range, visible, localStore, enabled]
	);

	const calculateOffset = useCallback(
		(scrollTop: number, scrollHeight: number) => {
			const containerHeight = containerResizeObserver.getSize().height;
			const offset = scrollTop / Math.max(0.0001, scrollHeight - containerHeight);
			return clamp(offset, 0, 1);
		},
		[containerResizeObserver]
	);

	const calculatePages = useCallback(() => {
		const containerHeight = containerResizeObserver.getSize().height;
		const contentHeight = contentResizeObserver.getSize().height;
		return contentHeight / containerHeight;
	}, [containerResizeObserver, contentResizeObserver]);

	const handleScroll = useCallback(() => {
		if (!enabled) {
			return;
		}

		const container = containerRef.current!;
		const { scrollTop, scrollHeight } = container;

		springScrollAnimationApi.start({ value: calculateOffset(scrollTop, scrollHeight) });
	}, [calculateOffset, containerRef, enabled, springScrollAnimationApi]);

	useEffect(
		() =>
			reaction(
				() => contentResizeObserver.getSize().height,
				(height) => {
					const fill = fillRef.current;
					fill!.style.height = `${height}px`;
					// spring.set(scrollTop / size.height);
				}
			),
		[contentResizeObserver, fillRef]
	);

	useEffect(
		() =>
			reaction(
				() => [containerResizeObserver.getSize().height, contentResizeObserver.getSize().height],
				([containerHeight]) => {
					const container = containerRef.current!;
					const { scrollTop, scrollHeight } = container;
					const pages = calculatePages();

					localStore.setPages(pages);
					localStore.setContainerHeight(containerHeight);
					localStore.setPixelAsProgress(1 / containerHeight);

					// console.log(
					// 	"Test:",
					// 	localStore.pixelAsProgress,
					// 	localStore.pixelAsProgress * (containerHeight * 0.5)
					// );

					springScrollAnimationApi.set({ value: calculateOffset(scrollTop, scrollHeight) });
				}
			),
		[
			localStore,
			containerRef,
			calculatePages,
			calculateOffset,
			contentResizeObserver,
			containerResizeObserver,
			springScrollAnimationApi,
		]
	);

	useLayoutEffect(() => {
		const container = containerRef.current!;
		container.scrollTop = 1;
		container.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			container.removeEventListener("scroll", handleScroll);
		};
	}, [containerRef, handleScroll]);

	return (
		<S.ScrollControls>
			<S.Container ref={containerRef} style={{ overflow: enabled ? "hidden auto" : "hidden" }}>
				<S.Fixed ref={fixedRef}>
					<context.Provider value={contextStore}>
						<S.Content
							ref={contentRef}
							style={{
								y: containerYTranslate,
							}}>
							{children}
						</S.Content>
					</context.Provider>
				</S.Fixed>
				<S.Fill ref={fillRef} />
			</S.Container>
		</S.ScrollControls>
	);
};

export const context = createContext<Context>(null!);

function rangeImpl(offset: number, from: number, distance: number, margin: number = 0) {
	const start = from - margin;
	const end = start + distance + margin * 2;
	return offset < start ? 0 : offset > end ? 1 : (offset - start) / (end - start);
}

function visibleImpl(offset: number, from: number, distance: number, margin: number = 0) {
	const start = from - margin;
	const end = start + distance + margin * 2;
	return offset >= start && offset <= end;
}

function curveImpl(offset: number, from: number, distance: number, margin: number = 0) {
	return Math.sin(rangeImpl(offset, from, distance, margin) * Math.PI);
}
