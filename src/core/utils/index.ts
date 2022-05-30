export function isAPISupported(api: string) {
	return api in window;
}

export function isCSSSupports(propertyName: string | string[], value: string) {
	if (CSS && CSS.supports) {
		return Array.isArray(propertyName)
			? propertyName.every((propertyName) => CSS.supports(propertyName, value))
			: CSS.supports(propertyName, value);
	}

	return false;
}

export function safelyParseJSON<T extends Record<string, any> | any[]>(string: string) {
	try {
		return JSON.parse(string) as T;
	} catch (e) {
		return null;
	}
}

export function camelCaseToPascalCase(string: string) {
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

export function splitRowsIntoChars(rows: string[]) {
	return rows.map((row) => splitIntoWords(row, true).map((word) => splitIntoChars(word)));
}

export function splitRowsIntoWords(rows: string[]) {
	return rows.map((row) => splitIntoWords(row, true));
}

export function mergeRefs<E = any>(...refs: (React.ForwardedRef<any> | null | undefined)[]) {
	const filteredRefs = refs.filter(Boolean);

	if (filteredRefs.length === 0) {
		return undefined;
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

export function createArray(arrayLength: number) {
	return Array(arrayLength).fill(null) as null[];
}

export function minAbs(...numbers: number[]) {
	let result = numbers[0];

	for (const number of numbers) {
		if (Math.abs(number) < Math.abs(result)) {
			result = number;
		}
	}

	return result;
}

export function maxAbs(...numbers: number[]) {
	let result = numbers[0];

	for (const number of numbers) {
		if (Math.abs(number) > Math.abs(result)) {
			result = number;
		}
	}

	return result;
}

export function clamp(number: number, min: number, max: number) {
	number = Math.max(number, min);
	number = Math.min(number, max);

	return number;
}

export function normalizeNumber(number: number, min: number, max: number) {
	return clamp((number - min) / (max - min) || 0, 0, 1);
}

export function lerp(x: number, y: number, t: number) {
	return (1 - t) * x + t * y;
}

export function damp(x: number, y: number, lambda: number, dt: number) {
	return lerp(x, y, 1 - Math.exp(-lambda * dt));
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
	// return calculateCurrentIndex2D(array.slice(0, x), y, z);
}

export function safelyGetElementDOMRect(element: HTMLElement | SVGElement | null) {
	return (
		element?.getBoundingClientRect() || {
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			width: 0,
			height: 0,
			x: 0,
			y: 0,
		}
	);
}

export function calculateElementOffset(element: HTMLElement | SVGElement | null) {
	const DOMRect = safelyGetElementDOMRect(element);

	const body = document.body;
	const documentElement = document.documentElement;

	const scrollTop = window.pageYOffset || documentElement.scrollTop || body.scrollTop;
	const scrollLeft = window.pageXOffset || documentElement.scrollLeft || body.scrollLeft;

	const clientTop = documentElement.clientTop || body.clientTop || 0;
	const clientLeft = documentElement.clientLeft || body.clientLeft || 0;

	const top = DOMRect.top + scrollTop - clientTop;
	const left = DOMRect.left + scrollLeft - clientLeft;

	return { top: Math.round(top), left: Math.round(left) };
}

export function calculateMousePositionInsideElement(
	element: HTMLElement | SVGElement | Document | null,
	mousePosition: { x: number; y: number }
) {
	const offset =
		element === document ? { top: 0, left: 0 } : calculateElementOffset(element as HTMLElement);

	return {
		x: mousePosition.x - offset.left || 0,
		y: mousePosition.y - offset.top || 0,
	};
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

export function vectorLength(vector: number[], center?: number[]) {
	const sum = vector.reduce(
		(acc, number, index) => acc + Math.pow(number - (center ? center[index] : 0), 2),
		0
	);
	return Math.sqrt(sum);
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

const app = document.getElementById("app");

export function scrollTo(scroll: number) {
	if (app) {
		app.scrollTop = scroll;
	}
}

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
	let isCooldown = false;

	return (...args: T) => {
		if (isCooldown) {
			return;
		}

		callback(...args);

		isCooldown = true;

		setTimeout(() => (isCooldown = false), time);
	};
}

export function throttle<T extends any[]>(callback: (...args: T) => void, time: number) {
	let isThrottled = false;
	let savedArgs: T | null = null;

	function wrapper(...args: T) {
		if (isThrottled) {
			// savedArgs = args;
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
