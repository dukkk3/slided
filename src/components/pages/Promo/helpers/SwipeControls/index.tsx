import { useCallback } from "react";
import { useGesture, FullGestureState } from "@use-gesture/react";

import { useIterationsControls } from "@components/providers/IterationsControlsProvider";

import { useBreakpoint } from "@core/hooks/useBreakpoint";
import { useIteration } from "@core/hooks/useIteration";

import { usePromo } from "../../index";

export const SwipeControls: React.FC = () => {
	const promo = usePromo();
	const breakpoint = useBreakpoint();
	const iterationsControls = useIterationsControls();
	const lastIteration = useIteration(iterationsControls.iterations - 1);

	const handleWheel = useCallback(
		({ wheeling, direction: [, dy], memo, elapsedTime }: FullGestureState<"wheel">) => {
			const swipeEnabled = !wheeling || elapsedTime > 150;
			const memoIsNumber = typeof memo === "number";

			if (swipeEnabled && !memoIsNumber) return null;
			if (swipeEnabled && memoIsNumber) {
				const direction = memo as number;

				switch (direction) {
					case 1:
						iterationsControls.next();
						break;
					case -1:
						iterationsControls.prev();
						break;
				}

				return null;
			}

			return dy;
		},
		[iterationsControls]
	);

	const handleDrag = useCallback(
		({ swipe: [, sy] }: FullGestureState<"drag">) => {
			switch (-sy) {
				case 1:
					iterationsControls.next();
					break;
				case -1:
					iterationsControls.prev();
					break;
			}
		},
		[iterationsControls]
	);

	useGesture(
		{
			onWheel: (state) => {
				const footer = promo.refs.footerContent.current;

				if (!iterationsControls.interactiveEnabled() || promo.store.feedbackOpened) return;
				if (lastIteration.started() && footer && footer.scrollTop > 0) return;

				return handleWheel(state);
			},
			onDrag: (state) => {
				const footer = promo.refs.footerContent.current;

				if (
					!iterationsControls.interactiveEnabled() ||
					!breakpoint.range("mobile", "laptop") ||
					promo.store.feedbackOpened
				)
					return;
				if (lastIteration.started() && footer && footer.scrollTop > 0) return;

				handleDrag(state);
			},
		},
		{ target: document, wheel: { axis: "y" }, drag: { axis: "y" } }
	);

	return null;
};
