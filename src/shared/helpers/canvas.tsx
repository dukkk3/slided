import { common } from "@shared/utils";
import { attach, createEvent, createStore, sample } from "effector";
import { forwardRef, useCallback, useEffect, useRef } from "react";
import useMeasure from "react-use-measure";

export const create = () => {
	const $image = createStore<HTMLImageElement | null>(null, {
		updateFilter: (update, current) => update?.src !== current?.src,
	});
	const $context = createStore<CanvasRenderingContext2D | null>(null);
	const $rect = createStore<{ width: number; height: number } | null>(null);

	const settedImage = createEvent<HTMLImageElement | null>();
	const settedContext = createEvent<CanvasRenderingContext2D | null>();
	const settedRect = createEvent<{ width: number; height: number }>();

	const drawCurrentImageFx = attach({
		source: { context: $context, image: $image, rect: $rect },
		effect: ({ context, image, rect }) => {
			if (!context || !rect) return;
			if (!image) {
				return context.clearRect(0, 0, rect.width, rect.height);
			}
			common.drawImageCover(context, image, 0, 0, rect.width, rect.height);
		},
	});

	const Canvas = forwardRef<HTMLCanvasElement, React.ComponentProps<"canvas">>((props, ref) => {
		const canvasRef = useRef<HTMLCanvasElement | null>();
		const contextRef = useRef<CanvasRenderingContext2D | null>(null);
		const [measureRef, rect] = useMeasure({ debounce: 100 });

		const handleRef = useCallback((node: HTMLCanvasElement | null) => {
			const context = node?.getContext("2d");
			contextRef.current = context || null;
			canvasRef.current = node || null;
			settedContext(context || null);
		}, []);

		useEffect(() => {
			const { width, height } = rect;
			const dpr = window.devicePixelRatio;
			const canvas = canvasRef.current;
			const context = contextRef.current;

			if (!canvas || !context) return;

			canvas.width = width * dpr;
			canvas.height = height * dpr;

			context.scale(dpr, dpr);

			settedRect({ width, height });
		}, [rect]);

		return <canvas {...props} ref={common.mergeRefs(ref, measureRef, handleRef)} />;
	});

	sample({
		clock: settedContext,
		target: $context,
	});

	sample({
		clock: settedImage,
		target: $image,
	});

	sample({
		clock: settedRect,
		target: $rect,
	});

	sample({
		clock: [$image, $context, $rect],
		target: drawCurrentImageFx,
	});

	return {
		Canvas,
		settedImage,
	};
};
