import { useCallback, useEffect, useRef } from "react";
import { reaction, transaction } from "mobx";
import useAnimationFrame from "@phntms/use-animation-frame";

import { Context as ScrollControlsContext } from "@components/common/hoc/ScrollControls";

import { useGlobalStore, useLocalStore, useResizeObserver, useScroll } from "@core/hooks";
import { drawImageCover, mergeRefs } from "@core/utils";
import { imagesHelper } from "@core/helpers";

import * as S from "./styled";

const START_FRAME_INDEX = 80;

function getIterations(
	scrollContext: ScrollControlsContext
): { frameIndex: number; visible: boolean; progress: number }[] {
	return [
		{
			frameIndex: 184,
			visible: scrollContext.animated.visible(0, 1 / scrollContext.store.pages),
			progress: scrollContext.animated.range(0, 1 / scrollContext.store.pages),
		},
		{
			frameIndex: 293,
			visible: scrollContext.animated.visible(
				1 / scrollContext.store.pages,
				2 / scrollContext.store.pages
			),
			progress: scrollContext.animated.range(
				1 / scrollContext.store.pages,
				2 / scrollContext.store.pages
			),
		},
	];
}

export const TableBackground: React.FC = () => {
	const scroll = useScroll();
	const canvasRef = useRef<HTMLCanvasElement>(null!);
	const containerRef = useRef<HTMLDivElement>(null);
	const contextRef = useRef<CanvasRenderingContext2D>(null!);
	const promoStore = useGlobalStore((store) => store.layout.promo);
	const canvasResizeObserver = useResizeObserver();
	const localStore = useLocalStore({
		animated: false,
		currentFrameIndex: 0 as number,
		startFrameIndex: null as number | null,
		targetFrameIndex: null as number | null,
	});

	const handleCanvasRef = useCallback((element: HTMLCanvasElement | null) => {
		if (!element) return;

		canvasRef.current = element;
		contextRef.current = element.getContext("2d", { alpha: null }) as CanvasRenderingContext2D;
	}, []);

	const drawFrame = useCallback(
		(index: number) => {
			const context = contextRef.current;
			const sequenceFrame = sequence.getSequence()[index];
			const { width, height } = canvasResizeObserver.getSize();

			drawImageCover(context, sequenceFrame.image, 0, 0, width, height, 0.5, 0.5);
		},
		[canvasResizeObserver]
	);

	const drawCurrentFrame = useCallback(() => {
		drawFrame(localStore.currentFrameIndex);
	}, [drawFrame, localStore]);

	const updateTargetFrameIndex = useCallback(
		(index: number) => {
			const { currentFrameIndex, animated } = localStore;

			if (animated || currentFrameIndex === index) return;

			transaction(() => {
				localStore.setAnimated(true);
				localStore.setTargetFrameIndex(index);
				localStore.setStartFrameIndex(currentFrameIndex);
			});
		},
		[localStore]
	);

	const clearAnimationState = useCallback(() => {
		localStore.setTargetFrameIndex(null);
		localStore.setStartFrameIndex(null);
		localStore.setAnimated(false);
	}, [localStore]);

	const handleScrollProgressChange = useCallback(
		(progress: number) => {
			const iterations = getIterations(scroll);
			const visibleIterationIndex = iterations.findIndex(({ visible }) => visible);

			if (visibleIterationIndex !== -1) {
				const iteration = iterations[visibleIterationIndex];
				const startFrameIndex =
					visibleIterationIndex === 0
						? START_FRAME_INDEX
						: iterations[visibleIterationIndex - 1].frameIndex;

				const framesRange = Math.abs(startFrameIndex - iteration.frameIndex);
				const frameIndex = startFrameIndex + Math.round(framesRange * iteration.progress);

				localStore.setTargetFrameIndex(frameIndex);
				drawCurrentFrame();
			} else {
				const iteration = iterations[iterations.length - 1];

				localStore.setCurrentFrameIndex(iteration.frameIndex);
				drawCurrentFrame();
			}
		},
		[drawCurrentFrame, localStore, scroll]
	);

	useAnimationFrame(() => {
		const { currentFrameIndex, targetFrameIndex } = localStore;

		if (targetFrameIndex === null) return;
		if (targetFrameIndex === currentFrameIndex) {
			clearAnimationState();
			return;
		} else {
			const sign =
				targetFrameIndex > currentFrameIndex ? 1 : targetFrameIndex < currentFrameIndex ? -1 : 0;
			const nextFrameIndex = currentFrameIndex + 1 * sign;

			localStore.setCurrentFrameIndex(nextFrameIndex);

			if (targetFrameIndex === nextFrameIndex) {
				clearAnimationState();
			}
		}

		drawCurrentFrame();
	}, 30);

	useEffect(
		() =>
			reaction(
				() => canvasResizeObserver.getSize(),
				(size) => {
					const dpr = window.devicePixelRatio;
					const canvas = canvasRef.current;
					const context = contextRef.current;

					canvas.width = size.width * dpr;
					canvas.height = size.height * dpr;

					context.scale(dpr, dpr);

					drawCurrentFrame();
				}
			),
		[canvasResizeObserver, drawCurrentFrame]
	);

	useEffect(() => {
		drawCurrentFrame();
		updateTargetFrameIndex(START_FRAME_INDEX);
	}, [drawCurrentFrame, updateTargetFrameIndex]);

	useEffect(
		() =>
			reaction(
				() => [localStore.animated, localStore.currentFrameIndex],
				([animated, currentFrameIndex]) => {
					if (!animated && currentFrameIndex >= START_FRAME_INDEX) {
						promoStore.setSequenceOpeningAnimationEnded(true);
					}
				}
			),
		[localStore, promoStore]
	);

	useEffect(
		() => scroll.animated.progress.onChange(handleScrollProgressChange),
		[scroll, handleScrollProgressChange]
	);

	return (
		<S.TableBackground ref={containerRef}>
			<S.Canvas ref={mergeRefs(canvasResizeObserver.ref, handleCanvasRef)} />
		</S.TableBackground>
	);
};

const framesCount = 294;
const sequence = imagesHelper.createImagesSequence(
	framesCount,
	(index) => `./images/table-sequence/${index + 1}.jpg`
);

sequence.preload();
