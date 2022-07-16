import React from "react";
import { clamp } from "./math.utils";

export function drawImageCover(
	ctx: CanvasRenderingContext2D,
	img: CanvasImageSource,
	x: number,
	y: number,
	w: number,
	h: number,
	offsetX: number = 0.5,
	offsetY: number = 0.5
) {
	// keep bounds [0.0, 1.0]
	offsetX = clamp(offsetX, 0, 1);
	offsetY = clamp(offsetY, 0, 1);

	let iw = img.width as number;
	let ih = img.height as number;
	let r = Math.min(w / iw, h / ih);
	let nw = iw * r; // new prop. width
	let nh = ih * r; // new prop. height
	let cx;
	let cy;
	let cw;
	let ch;
	let ar = 1;

	// decide which gap to fill
	if (nw < w) ar = w / nw;
	if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh; // updated
	nw *= ar;
	nh *= ar;

	// calc source rectangle
	cw = iw / (nw / w);
	ch = ih / (nh / h);

	cx = (iw - cw) * offsetX;
	cy = (ih - ch) * offsetY;

	// make sure source rectangle is valid
	cx = Math.max(cx, 0);
	cy = Math.max(cy, 0);

	cw = Math.min(cw, iw);
	ch = Math.min(ch, ih);

	// fill image in dest. rectangle
	ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

export function generateRandomInteger(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}

export function debounce<T extends any[]>(callback: (...args: T) => void, time: number) {
	let timeout: any;

	return function (this: any, ...args: any[]) {
		const effect = () => {
			timeout = null;
			return callback.apply(this, args as unknown as any);
		};

		clearTimeout(timeout);

		timeout = setTimeout(effect, time);
	};
}

export function throttle<T extends any[]>(callback: (...args: T) => void, time: number) {
	let isThrottled = false;
	let savedArgs: T | null = null;

	function wrapper(...args: T) {
		if (isThrottled) {
			savedArgs = args;
			return;
		}

		callback(...args);

		isThrottled = true;

		setTimeout(function () {
			isThrottled = false;

			if (savedArgs) {
				wrapper(...savedArgs);
				savedArgs = null;
			}
		}, time);
	}

	return wrapper;
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getMousePositionFromEvent(event: TouchEvent | MouseEvent) {
	const hasTouches = "touches" in event;
	// @ts-ignore
	const targetProperty = hasTouches ? event.touches[0] : event;

	return {
		x: targetProperty.pageX || 0,
		y: targetProperty.pageY || 0,
	};
}

export function normalizePosition(
	position: { x: number; y: number },
	bounds: { width: number; height: number }
) {
	const normalized = {
		x: position.x / Math.max(bounds.width, 0.1),
		y: position.y / Math.max(bounds.height, 0.1),
	};
	return {
		x: clamp((normalized.x - 0.5) * 2, -1, 1),
		y: clamp((normalized.y - 0.5) * 2, -1, 1),
	};
}

export function createArray(arrayLength: number) {
	return Array(arrayLength).fill(null) as null[];
}

export function splitRowsIntoChars(rows: string[]) {
	return rows.map((row) => splitIntoWords(row, true).map((word) => splitIntoChars(word)));
}

export function splitRowsIntoWords(rows: string[]) {
	return rows.map((row) => splitIntoWords(row, true));
}

export function mergeRefs<E = any>(
	...refs: (React.ForwardedRef<any> | null | undefined)[]
): React.RefCallback<E> {
	const filteredRefs = refs.filter(Boolean);

	if (filteredRefs.length === 0) {
		return undefined as any;
	}

	return (instance: E | null) => {
		for (const ref of filteredRefs) {
			if (typeof ref === "function") {
				ref(instance);
			} else if (ref) {
				ref.current = instance;
			}
		}
	};
}

export function camelCase2PascalCase(string: string) {
	const [firstLetter, ...rest] = string;
	return `${firstLetter.toUpperCase()}${rest.join("")}`;
}

export function splitIntoChars(string: string) {
	return string.split("");
}

export function splitIntoWords(string: string, includeSpaces: boolean = false) {
	return string
		.split(" ")
		.flatMap((word, index) => (includeSpaces && index !== 0 ? [" ", word] : [word]));
}

export function calculateCurrentIndex2D(array: any[], x: number, y: number) {
	return array.slice(0, x).reduce((acc, row) => acc + row.length, 0) + y;
}

export function calculateCurrentIndex3D(array: any[][], x: number, y: number, z: number) {
	return (
		array
			.slice(0, x + 1)
			.reduce(
				(acc, row, rowIndex) =>
					acc +
					(rowIndex === x
						? row
								.slice(0, y + 1)
								.reduce((acc, word, wordIndex) => (wordIndex === y ? acc : acc + word.length), 0)
						: row.flat(Infinity).length),
				0
			) + z
	);
}

export function lockOrientation(orientation: OrientationLockType) {
	const d = document.documentElement as any;

	if (d.requestFullscreen) {
		d.requestFullscreen();
	} else if (d.mozRequestFullScreen) {
		d.mozRequestFullScreen();
	} else if (d.webkitRequestFullscreen) {
		d.webkitRequestFullscreen();
	} else if (d.msRequestFullscreen) {
		d.msRequestFullscreen();
	}

	window.screen.orientation.lock(orientation);
}

export function unlockOrientation() {
	window.screen.orientation.unlock();

	const d = document as any;

	if (d.exitFullscreen) {
		d.exitFullscreen();
	} else if (d.webkitExitFullscreen) {
		d.webkitExitFullscreen();
	} else if (d.mozCancelFullScreen) {
		d.mozCancelFullScreen();
	} else if (d.msExitFullscreen) {
		d.msExitFullscreen();
	}
}

export function pick<T extends object, K extends keyof T>(object: T, ...keys: K[]) {
	return keys.reduce((acc, key) => ({ ...acc, [key]: object[key] }), {} as Pick<T, K>);
}

export function exclude<T extends object, K extends keyof T>(object: T, ...keys: K[]) {
	return (Object.keys(object) as (keyof T)[])
		.filter((key) => !keys.includes(key as any))
		.reduce((acc, key) => ({ ...acc, [key]: object[key] }), {} as Exclude<T, K>);
}
