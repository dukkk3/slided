import { useMemo, useEffect } from "react";
import useMeasure, { RectReadOnly } from "react-use-measure";
import { createEvent, createStore, sample } from "effector";
import { SpringValue, Interpolation } from "@react-spring/web";

import { math, array } from "../utils";
import { useUnit } from "effector-react";

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
	progress: SpringValue<number> | Interpolation<any, number> | null;
	from: RectReadOnly | Key | null;
	to: RectReadOnly | Key | null;
}

const create = <Alias extends string>() => {
	const rects = new Map<Alias, RectReadOnly>();

	const attached = createEvent<{
		from?: RectReadOnly | Alias | null;
		to: RectReadOnly | Alias;
		progress: SpringValue<number> | Interpolation<any, number>;
	}>();

	const $config = createStore<Config<Alias>>({
		progress: null,
		from: null,
		to: null,
	});

	const resolveRect = (rect: RectReadOnly | Alias | null) => {
		if (typeof rect === "string") return rects.get(rect as Alias) || null;
		return rect;
	};

	const $style = $config.map((config) => {
		const orderedRects = array.orderBy(
			[resolveRect(config.from)!, resolveRect(config.to)!].filter(Boolean),
			[
				{ by: "width", sort: "desc" },
				{ by: "height", sort: "desc" },
			]
		);

		const baseRect = orderedRects.length
			? {
					width: orderedRects[0].width,
					height: orderedRects[0].height,
			  }
			: null;

		const { from, to, progress } = config;

		const fromRect = resolveRect(from);
		const toRect = resolveRect(to);

		if (!fromRect || !baseRect) {
			return {};
		}

		if (!toRect) {
			return fromRect;
		}

		return {
			width: baseRect?.width,
			height: baseRect?.height,
			transformOrigin: "left top",
			x: progress?.to((value) => {
				return calculateRectInterpolation(value, fromRect.left, toRect.left);
			}),
			y: progress?.to((value) => {
				return calculateRectInterpolation(value, fromRect.top, toRect.top);
			}),
			scaleX: progress?.to((value) => {
				return calculateScaleInterpolation(value, baseRect.width, fromRect.width, toRect.width);
			}),
			scaleY: progress?.to((value) => {
				return calculateScaleInterpolation(value, baseRect.height, fromRect.height, toRect.height);
			}),
		};
	});

	const removeRect = (key: Alias) => {
		rects.delete(key);
	};

	const setRect = (key: Alias, rect: RectReadOnly) => {
		rects.set(key, rect);
	};

	const useStyle = () => useUnit($style);

	const useRect = (key: Alias) => {
		const [ref, rect] = useMeasure({ debounce: 100 });
		useEffect(() => {
			setRect(key, rect);
			return () => removeRect(key);
		}, [rect]);
		return useMemo(() => [ref, rect] as const, [ref, rect]);
	};

	sample({
		clock: attached,
		source: $config,
		fn: (config, { from, to, progress }) => {
			let _rect: RectReadOnly | Alias;

			const { progress: _progress, to: _to, from: _from } = config;
			const _toRect = resolveRect(_to);
			const _fromRect = resolveRect(_from);

			if (!from && from !== null && _fromRect && _toRect && _progress) {
				const rectKeys = Object.keys(_toRect);
				_rect = array.record(rectKeys, (key) =>
					calculateRectInterpolation(_progress.get(), _fromRect[key], _toRect[key])
				) as RectReadOnly;
			} else if (from === null) {
				_rect = DEFAULT_RECT;
			} else {
				_rect = from || _to || DEFAULT_RECT;
			}

			return {
				...config,
				to,
				from: _rect,
				progress: progress,
			};
		},
		target: $config,
	});

	return {
		attach: attached,
		useRect,
		useStyle,
	};
};
