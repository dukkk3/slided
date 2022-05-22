import { createContext, useCallback, useEffect, useLayoutEffect, useMemo } from "react";
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
		offset: number;
		pages: number;
		containerHeight: number;
	} & ContextHelpers;
	animated: { offset: SpringValue<number> } & ContextHelpers;
}

export interface Props {
	enabled?: boolean;
	children?: React.ReactNode;
}

export const ScrollControls: React.FC<Props> = ({ children, enabled = true }) => {
	const [containerRef, fixedRef, fillRef, contentRef] = useRefs<HTMLDivElement>(null);
	const containerResizeObserver = useResizeObserver({ ref: containerRef });
	const contentResizeObserver = useResizeObserver({ ref: contentRef });
	const localStore = useLocalStore<Context["store"]>({
		pages: 0,
		offset: 0,
		containerHeight: 0,
		range: function (from: number, distance: number, margin?: number) {
			return rangeImpl(this.offset, from, distance, margin);
		},
		curve: function (from: number, distance: number, margin?: number) {
			return curveImpl(this.offset, from, distance, margin);
		},
		visible: function (from: number, distance: number, margin?: number) {
			return visibleImpl(this.offset, from, distance, margin);
		},
	});
	const [contentStyle, contentAnimationControl] = useSpring(() => ({
		offset: 0,
		onChange: {
			offset: (value: number) => {
				localStore.setOffset(value);
			},
		},
	}));

	const visible = useCallback(
		(from: number, distance: number, margin?: number) => {
			return visibleImpl(contentStyle.offset.get(), from, distance, margin);
		},
		[contentStyle]
	);

	const range = useCallback(
		(from: number, distance: number, margin?: number) => {
			return rangeImpl(contentStyle.offset.get(), from, distance, margin);
		},
		[contentStyle]
	);

	const curve = useCallback(
		(from: number, distance: number, margin?: number) => {
			return curveImpl(contentStyle.offset.get(), from, distance, margin);
		},
		[contentStyle]
	);

	const contextStore = useMemo<Context>(
		() => ({
			animated: { offset: contentStyle.offset, curve, range, visible },
			store: localStore,
		}),
		[contentStyle, curve, localStore, range, visible]
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
		contentAnimationControl.start({ offset: calculateOffset(scrollTop, scrollHeight) });
	}, [calculateOffset, containerRef, contentAnimationControl, enabled]);

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
					contentAnimationControl.set({ offset: calculateOffset(scrollTop, scrollHeight) });
				}
			),
		[
			calculateOffset,
			calculatePages,
			containerRef,
			containerResizeObserver,
			contentAnimationControl,
			contentResizeObserver,
			localStore,
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
								y: contentStyle.offset.to((value) => {
									const containerHeight = containerResizeObserver.getSize().height;
									const y = -(value * (localStore.pages - 1)) * containerHeight;
									return y;
								}),
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
	return Math.sin(rangeImpl(from, distance, margin) * Math.PI);
}
