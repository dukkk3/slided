import { createEffect, sample, restore } from "effector";
import { createGate } from "effector-react";
import { reshape } from "patronum";

import * as model from "../../main-page.model";

import * as config from "./scroll-sync.config";

export const Gate = createGate<{
	element: HTMLElement | null;
}>({ defaultState: { element: null } });

export const $enabled = model.$interactiveEnabled;
export const $runnedToProgress = restore(model.toProgressRunned, 0);

export const { progress, toProgressRunned } = model;

const { $element } = reshape({
	source: Gate.state,
	shape: {
		$element: ({ element }) => element || null,
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
	},
	filter: ({ status, element }) => Boolean(status && element),
	fn: ({ element }) => ({
		element: element!,
		progress: progress.get(),
		iterationsCount: config.ITERATIONS_COUNT,
	}),
	target: progressToScrollFx,
});
