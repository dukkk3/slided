import { type SpringValue, config } from "@react-spring/web";
import { useScroll } from "@use-gesture/react";
import { Event, createEffect, sample, type Store } from "effector";
import { useGate, useUnit } from "effector-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import { common, math } from "@shared/utils";

import * as model from "./with-scroll-sync.model";
import * as S from "./with-scroll-sync.styled";

interface ScrollAreaProps extends Omit<WithScrollSyncProps, "$enabled" | "$toProgressRunned"> {
	children?: React.ReactNode;
	runnedToProgress?: number | null;
	enabled?: boolean;
}

const ScrollArea = memo(
	({
		children,
		progress,
		iterationsCount,
		iterationFactor = 1,
		enabled,
		runnedToProgress,
	}: ScrollAreaProps) => {
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

		useEffect(() => {
			if (!runnedToProgress && runnedToProgress !== 0) return;
			if (!scrollArea) return;

			scrollUpdateDisabledRef.current = true;

			const progress = runnedToProgress / iterationsCount;
			let scrollHeight = scrollArea.scrollHeight || 0;

			scrollHeight -= scrollArea.offsetHeight || 0;
			scrollHeight = Math.max(scrollHeight, 0);

			scrollArea.scrollTop = scrollHeight * progress;

			setTimeout(() => (scrollUpdateDisabledRef.current = false), 100);
		}, [iterationsCount, runnedToProgress, scrollArea]);

		return (
			<S.ScrollArea ref={common.mergeRefs(handleScrollArea, scrollAreaRef)} $enabled={enabled}>
				{children}
				<S.ScrollContent
					style={{ height: `calc(${iterationsCount + 1} * ${iterationFactor} * 100vh)` }}
				/>
			</S.ScrollArea>
		);
	}
);

interface WithScrollSyncProps {
	progress: SpringValue<number>;
	$enabled: Store<boolean>;
	$toProgressRunned: Store<number | null>;
	iterationFactor?: number;
	iterationsCount: number;
}

export const withScrollSync =
	({ $enabled, $toProgressRunned, ...rest }: WithScrollSyncProps) =>
	(Component: React.FC) =>
	(props: any) => {
		const runnedToProgress = useUnit($toProgressRunned);
		const enabled = useUnit($enabled);

		return (
			<ScrollArea {...rest} enabled={enabled} runnedToProgress={runnedToProgress}>
				<Component {...props} />
			</ScrollArea>
		);
	};
