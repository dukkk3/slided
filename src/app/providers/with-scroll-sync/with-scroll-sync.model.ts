import { createEffect, sample } from "effector";
import { createGate } from "effector-react";
import { reshape } from "patronum";

import type { LikeSpringValue } from "@shared/types";

export const Gate = createGate<{
	element: HTMLElement | null;
	progress: LikeSpringValue<number>;
	iterationsCount: number;
} | null>({ defaultState: null });

const { $element, $progress, $iterationsCount } = reshape({
	source: Gate.state,
	shape: {
		$element: (state) => state?.element || null,
		$progress: (state) => state?.progress || null,
		$iterationsCount: (state) => state?.iterationsCount || null,
	},
});

const progressToScrollFx = createEffect(
	({
		progress,
		element,
		iterationsCount,
	}: {
		progress: number;
		element: HTMLElement;
		iterationsCount: number;
	}) => {
		const scrollHeight = element.scrollHeight;
		const normalizedProgress = progress / iterationsCount;
		element.scrollTop = normalizedProgress * scrollHeight;
	}
);

sample({
	source: {
		status: Gate.status,
		element: $element,
		progress: $progress,
		iterationsCount: $iterationsCount,
	},
	filter: ({ status, element, progress, iterationsCount }) =>
		Boolean(status && element && progress && iterationsCount),
	fn: ({ element, progress, iterationsCount }) => ({
		element: element!,
		progress: progress!.get(),
		iterationsCount: iterationsCount!,
	}),
	target: progressToScrollFx,
});
