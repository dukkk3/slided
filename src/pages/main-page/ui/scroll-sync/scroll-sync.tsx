import { config as springConfig } from "@react-spring/web";
import { useScroll } from "@use-gesture/react";
import { useGate, useUnit } from "effector-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import { common, math } from "@shared/utils";

import * as config from "./scroll-sync.config";
import * as model from "./scroll-sync.model";
import * as S from "./scroll-sync.styled";

export interface ScrollSyncProps extends React.ComponentProps<"div"> {
	children?: React.ReactNode;
}

export const ScrollSync = memo(({ children }: ScrollSyncProps) => {
	const enabled = useUnit(model.$enabled);
	const runnedToProgress = useUnit(model.$runnedToProgress);
	const scrollUpdateDisabledRef = useRef(false);
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const [scrollArea, setScrollArea] = useState<HTMLElement | null>(null);

	const handleScrollArea = useCallback((node: HTMLElement | null) => {
		setScrollArea(node);
	}, []);

	useScroll(
		({ xy: [, y], ...rest }) => {
			if (scrollUpdateDisabledRef.current) return;

			let scrollHeight = scrollArea?.scrollHeight || 0;

			scrollHeight -= scrollArea?.offsetHeight || 0;
			scrollHeight = Math.max(scrollHeight, 0);

			if (scrollHeight < 0) {
				return;
			}

			let targetProgress = math.clamp(y / scrollHeight, 0, 1);
			targetProgress *= config.ITERATIONS_COUNT;

			model.progress.start(targetProgress, { config: springConfig.molasses });
		},
		{ target: scrollAreaRef, eventOptions: { passive: true } }
	);

	useGate(model.Gate, {
		element: scrollArea,
	});

	useEffect(() => {
		if (!runnedToProgress && runnedToProgress !== 0) return;
		if (!scrollArea) return;

		scrollUpdateDisabledRef.current = true;

		const progress = runnedToProgress / config.ITERATIONS_COUNT;
		let scrollHeight = scrollArea.scrollHeight || 0;

		scrollHeight -= scrollArea.offsetHeight || 0;
		scrollHeight = Math.max(scrollHeight, 0);

		scrollArea.scrollTop = scrollHeight * progress;

		setTimeout(() => (scrollUpdateDisabledRef.current = false), 100);
	}, [runnedToProgress, scrollArea]);

	return (
		<S.ScrollArea ref={common.mergeRefs(handleScrollArea, scrollAreaRef)} $enabled={enabled}>
			{children}
			<S.ScrollContent
				style={{ height: `calc(${config.ITERATIONS_COUNT + 1} * ${config.ITERATION_FACTOR} * 100vh)` }}
			/>
		</S.ScrollArea>
	);
});
