import { createStore, createEvent, sample } from "effector";
import { useUnit } from "effector-react";
import { useEffect, useMemo } from "react";
import useMeasure, { type RectReadOnly } from "react-use-measure";

const DEFAULT_RECT: RectReadOnly = {
	width: 0,
	height: 0,
	x: 0,
	y: 0,
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
};

export const create = () => {
	const $rect = createStore<RectReadOnly>(DEFAULT_RECT);
	const rectSetted = createEvent<RectReadOnly>();

	const useRectOf = () => {
		const [measureRef, rect] = useMeasure({ debounce: 100, offsetSize: true });

		useEffect(() => {
			if (Object.keys(rect).every((key) => !rect[key])) return;
			console.log(rect);
			rectSetted(rect);
		}, [rect]);

		return useMemo(() => [measureRef, rect] as const, [measureRef, rect]);
	};

	const useRect = () => {
		return useUnit($rect);
	};

	sample({
		clock: rectSetted,
		target: $rect,
	});

	return {
		useRect,
		useRectOf,
	};
};
