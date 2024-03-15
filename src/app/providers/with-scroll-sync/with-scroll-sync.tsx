import { type SpringValue, config } from "@react-spring/web";
import { useScroll } from "@use-gesture/react";
import { useGate } from "effector-react";
import { memo, useCallback, useRef, useState } from "react";

import { common, math } from "@shared/utils";

import * as model from "./with-scroll-sync.model";
import * as S from "./with-scroll-sync.styled";

interface ScrollAreaProps extends WithScrollSyncProps {
	children?: React.ReactNode;
}

const ScrollArea = memo(({ children, progress, iterationsCount }: ScrollAreaProps) => {
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const [scrollArea, setScrollArea] = useState<HTMLElement | null>(null);

	const handleScrollArea = useCallback((node: HTMLElement | null) => {
		setScrollArea(node);
	}, []);

	useScroll(
		({ xy: [, y], event }) => {
			let scrollHeight = scrollArea?.scrollHeight || 0;

			scrollHeight -= scrollArea?.offsetHeight || 0;
			scrollHeight = Math.max(scrollHeight, 0);

			if (scrollHeight < 0) {
				return;
			}

			let targetProgress = math.clamp(y / scrollHeight, 0, 1);
			targetProgress *= iterationsCount;

			progress.start(targetProgress, { config: config.molasses });
		},
		{ target: scrollAreaRef, eventOptions: { passive: true } }
	);

	useGate(model.Gate, {
		progress,
		iterationsCount,
		element: scrollArea,
	});

	return (
		<S.ScrollArea ref={common.mergeRefs(handleScrollArea, scrollAreaRef)}>
			{children}
			<S.ScrollContent style={{ height: `calc(${iterationsCount + 1} * 300vh)` }} />
		</S.ScrollArea>
	);
});

interface WithScrollSyncProps {
	progress: SpringValue<number>;
	iterationsCount: number;
}

export const withScrollSync =
	(config: WithScrollSyncProps) => (Component: React.FC) => (props: any) =>
		(
			<ScrollArea {...config}>
				<Component {...props} />
			</ScrollArea>
		);
