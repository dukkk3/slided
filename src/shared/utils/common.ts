import { clamp } from "./math";

export const variant = <Then = undefined, Else = undefined>(config: {
	if: boolean;
	then?: Then;
	else?: Else;
}) => {
	return config.if ? config.then : config.else;
};

export const isFunction = (arg: unknown): arg is Function => arg instanceof Function;

export const mergeRefs = <E = any>(
	...refs: (React.ForwardedRef<any> | null | undefined)[]
): ((instance: E | null) => void) => {
	const filteredRefs = refs.filter(Boolean);

	if (filteredRefs.length === 0) {
		return undefined as any;
	}

	return (instance: E | null) => {
		for (const ref of filteredRefs) {
			if (isFunction(ref)) {
				ref(instance);
			} else if (ref) {
				ref.current = instance;
			}
		}
	};
};

export const mergeCallbacks = <T extends Function>(
	...callbacks: (T | null | undefined)[]
): ((...args: any[]) => void) => {
	const filteredCallbacks = callbacks.filter(Boolean) as T[];

	if (filteredCallbacks.length === 0) {
		return () => {};
	}

	return (...args: any[]) => {
		for (const callback of filteredCallbacks) {
			callback(...args);
		}
	};
};

export const drawImageCover = (
	ctx: CanvasRenderingContext2D,
	img: HTMLImageElement,
	x: number,
	y: number,
	w: number,
	h: number,
	offsetX: number = 0.5,
	offsetY: number = 0.5
) => {
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
};
