import { createEvent, createStore, sample, combine, type Store } from "effector";
import { useUnit } from "effector-react";
import { previous } from "patronum";
import { useMemo, useEffect } from "react";
import useMeasure, { type RectReadOnly } from "react-use-measure";

import type { LikeSpringValue } from "@shared/types";

import { math, array } from "../utils";

const calculateRectInterpolation = (progress: number, from: number, to: number) => {
	return from + (to - from) * progress;
};

const calculateScaleInterpolation = (progress: number, base: number, from: number, to: number) => {
	from = math.invert(from / base);
	to = math.invert(to / base);
	return math.invert(from + (to - from) * progress);
};

const DEFAULT_RECT: RectReadOnly = {
	width: 0,
	height: 0,
	left: 0,
	top: 0,
	right: 0,
	bottom: 0,
	x: 0,
	y: 0,
};

interface Config<Key extends string> {
	progress: LikeSpringValue<number> | null;
	current: Key | null;
	to: Key | null;
}

interface InterpolationChain<Key> {
	from: Key;
	to: Key;
	progress: LikeSpringValue<number>;
	filter: Store<boolean>;
}

export const create = <Key extends string>(initialState: Key, chain: InterpolationChain<Key>[]) => {
	const $rects = createStore<Record<Key, RectReadOnly>>({} as any);
	const $chainIndex = combine(
		chain.map(({ filter }) => filter),
		(filters) => {
			return filters.findLastIndex((filter) => filter);
		}
	);

	const $baseRect = $rects.map((rects) => {
		const orderedRects = array.orderBy(Object.values(rects).filter(Boolean) as RectReadOnly[], [
			{ by: "width", sort: "desc" },
			{ by: "height", sort: "desc" },
		]);

		return (orderedRects[0] || null) as RectReadOnly | null;
	});

	const $rectsRange = combine(
		{
			rects: $rects,
			chainIndex: $chainIndex,
		},
		({ rects, chainIndex }) => {
			if (chainIndex < 0) return null;
			const chainItem = chain[chainIndex];
			return {
				from: rects[chainItem.from] || null,
				to: rects[chainItem.to] || null,
			};
		}
	);

	const $style = combine({
		chainIndex: $chainIndex,
		rects: $rects,
		rectsRange: $rectsRange,
		baseRect: $baseRect,
	}).map(({ chainIndex, rects, rectsRange, baseRect }) => {
		const from = {
			width: 0,
			height: 0,
			top: 0,
			left: 0,
		};

		const to = {
			width: rectsRange?.to?.width || 0,
			height: rectsRange?.to?.height || 0,
			top: rectsRange?.to?.top || 0,
			left: rectsRange?.to?.left || 0,
		};

		if (chainIndex < 0) {
			from.top = rects[initialState]?.top || 0;
			from.left = rects[initialState]?.left || 0;
			from.width = rects[initialState]?.width || 0;
			from.height = rects[initialState]?.height || 0;
		} else {
			from.top = rectsRange?.from?.top || 0;
			from.left = rectsRange?.from?.left || 0;
			from.width = rectsRange?.from?.width || 0;
			from.height = rectsRange?.from?.height || 0;
		}

		if (!rectsRange?.to) {
			return {
				...from,
				width: baseRect?.width,
				height: baseRect?.height,
			};
		}

		const chainItem = chain[chainIndex];

		return {
			width: baseRect?.width,
			height: baseRect?.height,
			transformOrigin: "left top",
			x: chainItem?.progress?.to((value) => {
				return calculateRectInterpolation(value, from.left, to.left);
			}),
			y: chainItem?.progress?.to((value) => {
				return calculateRectInterpolation(value, from.top, to.top);
			}),
			scaleX: chainItem?.progress?.to((value) => {
				return calculateScaleInterpolation(value, baseRect?.width || 0, from.width, to.width);
			}),
			scaleY: chainItem?.progress?.to((value) => {
				return calculateScaleInterpolation(value, baseRect?.height || 0, from.height, to.height);
			}),
		};
	});

	const rectRemoved = createEvent<Key>();
	const rectSetted = createEvent<{ key: Key; rect: RectReadOnly }>();

	const useStyle = () => useUnit($style);

	const useRect = (key: Key) => {
		const [ref, rect] = useMeasure({ debounce: 100 });

		useEffect(() => {
			if (Object.keys(rect).every((key) => !rect[key])) return;
			rectSetted({ key, rect });
		}, [key, rect]);

		useEffect(() => {
			return () => {
				// rectRemoved(key);
			};
		}, [key]);

		return useMemo(() => [ref, rect] as const, [ref, rect]);
	};

	sample({
		clock: rectSetted,
		source: $rects,
		fn: (rects, { key, rect }) => ({ ...rects, [key]: rect }),
		target: $rects,
	});

	sample({
		clock: rectRemoved,
		source: $rects,
		fn: (rects, key) => {
			const newRects = { ...rects };
			delete newRects[key];
			return newRects;
		},
		target: $rects,
	});

	return {
		useRect,
		useStyle,
	};
};
