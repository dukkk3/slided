import { useCallback, useRef, useEffect } from "react";
import { reaction } from "mobx";

import { mergeRefs, drawImageCover } from "@core/utils/common.utils";
import { Sequence } from "@core/classes/Sequence";
import { clamp } from "@core/utils/math.utils";

import { useLocalStore } from "./useLocalStore";
import { useResizeObserver } from "./useResizeObserver";

export interface Options {
	resizeObserverDebounce?: number;
}

export function useCanvasSequence(sequence: Sequence, { resizeObserverDebounce }: Options = {}) {
	const canvasRef = useRef<HTMLCanvasElement>(null!);
	const contextRef = useRef<CanvasRenderingContext2D>(null!);
	const previousFrameRef = useRef<number>(null!);

	const localStore = useLocalStore({ currentFrame: 0 });
	const canvasResizeObserver = useResizeObserver({ debounce: resizeObserverDebounce });

	const getCurrentFrame = useCallback(() => {
		return localStore.currentFrame;
	}, [localStore]);

	const setCurrentFrame = useCallback(
		(frame: number) => {
			const frameInBounds = clamp(frame, 0, sequence.amount);
			localStore.setCurrentFrame(frameInBounds);
		},
		[localStore, sequence.amount]
	);

	const drawFrame = useCallback(
		(index: number, rerenderEnabled = false) => {
			const context = contextRef.current;
			const sequenceItem = sequence.items[index];
			const { width, height } = canvasResizeObserver.getSize();

			if ((previousFrameRef.current === index && !rerenderEnabled) || !sequenceItem.loaded) return;

			drawImageCover(context, sequenceItem.image, 0, 0, width, height, 0.5, 0.5);
			previousFrameRef.current = index;
		},
		[canvasResizeObserver, sequence]
	);

	const drawCurrentFrame = useCallback(
		(rerenderEnabled?: boolean) => {
			drawFrame(localStore.currentFrame, rerenderEnabled);
		},
		[drawFrame, localStore]
	);

	const updateCanvasSize = useCallback(() => {
		const { width, height } = canvasResizeObserver.getSize();
		const dpr = window.devicePixelRatio;
		const canvas = canvasRef.current;
		const context = contextRef.current;

		canvas.width = width * dpr;
		canvas.height = height * dpr;

		context.scale(dpr, dpr);

		drawCurrentFrame(true);
	}, [canvasResizeObserver, drawCurrentFrame]);

	const handleCanvasRef = useCallback(
		(element: HTMLCanvasElement | null) => {
			if (!element) return;

			canvasRef.current = element;
			contextRef.current = element.getContext("2d", { alpha: null }) as CanvasRenderingContext2D;
			drawCurrentFrame(true);
		},
		[drawCurrentFrame]
	);

	useEffect(
		() =>
			reaction(
				() => canvasResizeObserver.getSize(),
				() => updateCanvasSize()
			),
		[canvasResizeObserver, drawCurrentFrame, updateCanvasSize]
	);

	return {
		ref: mergeRefs(canvasResizeObserver.ref, handleCanvasRef),
		drawFrame,
		setCurrentFrame,
		getCurrentFrame,
		drawCurrentFrame,
	};
}
