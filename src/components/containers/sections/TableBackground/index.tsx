import { useCallback, useEffect, useRef } from "react";
import { reaction, transaction } from "mobx";
import useAnimationFrame from "@phntms/use-animation-frame";

import {
	useLocalStore,
	useGlobalStore,
	useResizeObserver,
	useIterationControls,
} from "@core/hooks";
import { clamp, drawImageCover, mergeRefs } from "@core/utils";
import { imagesHelper } from "@core/helpers";

import { getVideoByName } from "@assets/videos";

import * as S from "./styled";

const iterations = [3.9, 8, 12, 17];

export const TableBackground: React.FC = () => {
	const videoRef = useRef<HTMLVideoElement>(null!);
	const localStore = useLocalStore({ currentTime: 0 });
	const promoStore = useGlobalStore((store) => store.layout.promo);
	const iterationControls = useIterationControls();

	const handleVideoTimeUpdate = useCallback(() => {
		const video = videoRef.current;
		localStore.setCurrentTime(video.currentTime);
	}, [localStore]);

	const drawIterationSequence = useCallback(
		(iteration: number) => {
			if (!iterationControls.storeLinear.inRange(iteration - 1, iteration)) return;

			const video = videoRef.current;
			const [startIteration, endIteration] = [iterations[iteration - 1], iterations[iteration]];
			const progress = iterationControls.storeLinear.toRange(
				iteration - 1,
				iteration === 3 ? 2.5 : iteration
			);

			const diff = Math.abs(startIteration - endIteration);
			const frameIndex = startIteration + diff * progress;

			video.currentTime = clamp(frameIndex, 0, video.duration - 0.01);
		},
		[iterationControls]
	);

	useEffect(
		() =>
			reaction(
				() => iterationControls.storeLinear.toRange(0, iterations.length - 1),
				(progress) => {
					if (!promoStore.interactiveEnabled()) return;

					drawIterationSequence(1);
					drawIterationSequence(2);
					drawIterationSequence(3);
				}
			),
		[drawIterationSequence, iterationControls, localStore, promoStore]
	);

	useEffect(
		() =>
			reaction(
				() => localStore.currentTime >= 3.5 && !promoStore.sequenceOpeningAnimationEnded,
				(opened) => {
					if (!opened) return;
					const video = videoRef.current;
					promoStore.setSequenceOpeningAnimationEnded(true);
					video.pause();
				}
			),
		[localStore, promoStore]
	);

	return (
		<S.TableBackground>
			<S.Video
				ref={videoRef}
				src={getVideoByName("TableSource")}
				playsInline
				muted
				autoPlay
				onTimeUpdate={handleVideoTimeUpdate}
			/>
		</S.TableBackground>
	);
};

// const iterations: { frameIndex: number }[] = [
// 	{ frameIndex: 95 },
// 	{ frameIndex: 177 },
// 	{ frameIndex: 275 },
// 	{ frameIndex: 293 },
// ];

// export const TableBackground: React.FC = () => {
// 	const canvasRef = useRef<HTMLCanvasElement>(null!);
// 	const containerRef = useRef<HTMLDivElement>(null);
// 	const contextRef = useRef<CanvasRenderingContext2D>(null!);
// 	const prevRenderedFrameIndexRef = useRef<number>(null!);
// 	const promoStore = useGlobalStore((store) => store.layout.promo);
// 	const iterationsControls = useIterationControls();
// 	const canvasResizeObserver = useResizeObserver();
// 	const localStore = useLocalStore({
// 		animated: false,
// 		currentFrameIndex: 0 as number,
// 		startFrameIndex: null as number | null,
// 		targetFrameIndex: null as number | null,
// 	});

// 	const handleCanvasRef = useCallback((element: HTMLCanvasElement | null) => {
// 		if (!element) return;

// 		canvasRef.current = element;
// 		contextRef.current = element.getContext("2d", { alpha: null }) as CanvasRenderingContext2D;
// 	}, []);

// 	const drawFrame = useCallback(
// 		(index: number, rerendering = false) => {
// 			if (prevRenderedFrameIndexRef.current === index && !rerendering) return;

// 			const context = contextRef.current;
// 			const sequenceFrame = sequence.getSequence()[index];
// 			const { width, height } = canvasResizeObserver.getSize();

// 			drawImageCover(context, sequenceFrame.image, 0, 0, width, height, 0.5, 0.5);
// 			prevRenderedFrameIndexRef.current = index;
// 		},
// 		[canvasResizeObserver]
// 	);

// 	const drawCurrentFrame = useCallback(
// 		(rerendering = false) => {
// 			drawFrame(localStore.currentFrameIndex, rerendering);
// 		},
// 		[drawFrame, localStore]
// 	);

// 	const updateTargetFrameIndex = useCallback(
// 		(index: number) => {
// 			const { currentFrameIndex } = localStore;

// 			if (currentFrameIndex === index) return;

// 			transaction(() => {
// 				localStore.setAnimated(true);
// 				localStore.setTargetFrameIndex(index);
// 				localStore.setStartFrameIndex(currentFrameIndex);
// 			});
// 		},
// 		[localStore]
// 	);

// 	const clearAnimationState = useCallback(() => {
// 		localStore.setTargetFrameIndex(null);
// 		localStore.setStartFrameIndex(null);
// 		localStore.setAnimated(false);
// 	}, [localStore]);

// 	const drawIterationSequence = useCallback(
// 		(iteration: number) => {
// 			if (!iterationsControls.store.inRange(iteration - 1, iteration)) return;

// 			const [startIteration, endIteration] = [iterations[iteration - 1], iterations[iteration]];
// 			const progress = iterationsControls.store.toRange(
// 				iteration - 1,
// 				iteration === 3 ? 2.5 : iteration
// 			);

// 			const diff = Math.abs(startIteration.frameIndex - endIteration.frameIndex);
// 			const frameIndex = startIteration.frameIndex + Math.round(diff * progress);

// 			localStore.setCurrentFrameIndex(frameIndex);
// 			drawCurrentFrame();
// 		},
// 		[drawCurrentFrame, iterationsControls.store, localStore]
// 	);

// 	useAnimationFrame(() => {
// 		const { currentFrameIndex, targetFrameIndex } = localStore;

// 		if (targetFrameIndex === null) return;
// 		if (targetFrameIndex === currentFrameIndex) {
// 			clearAnimationState();
// 			return;
// 		} else {
// 			const sign =
// 				targetFrameIndex > currentFrameIndex ? 1 : targetFrameIndex < currentFrameIndex ? -1 : 0;
// 			const nextFrameIndex = currentFrameIndex + 1 * sign;

// 			localStore.setCurrentFrameIndex(nextFrameIndex);

// 			if (targetFrameIndex === nextFrameIndex) {
// 				clearAnimationState();
// 			}
// 		}

// 		drawCurrentFrame();
// 	}, 30);

// 	useEffect(
// 		() =>
// 			reaction(
// 				() => canvasResizeObserver.getSize(),
// 				(size) => {
// 					const dpr = window.devicePixelRatio;
// 					const canvas = canvasRef.current;
// 					const context = contextRef.current;

// 					canvas.width = size.width * dpr;
// 					canvas.height = size.height * dpr;

// 					context.scale(dpr, dpr);

// 					drawCurrentFrame(true);
// 				}
// 			),
// 		[canvasResizeObserver, drawCurrentFrame]
// 	);

// 	useEffect(() => {
// 		if (iterationsControls.store.progress > 0.1) return;
// 		updateTargetFrameIndex(iterations[0].frameIndex);
// 	}, [iterationsControls, updateTargetFrameIndex]);

// 	useEffect(
// 		() =>
// 			reaction(
// 				() => iterationsControls.store.toRange(0, iterations.length - 1),
// 				(progress) => {
// 					if (!promoStore.interactiveEnabled()) return;

// 					drawIterationSequence(1);
// 					drawIterationSequence(2);
// 					drawIterationSequence(3);
// 				}
// 			),
// 		[drawCurrentFrame, drawIterationSequence, iterationsControls, localStore, promoStore]
// 	);

// 	useEffect(
// 		() =>
// 			reaction(
// 				() => [localStore.animated, localStore.currentFrameIndex],
// 				([animated, currentFrameIndex]) => {
// 					if (!animated && currentFrameIndex >= iterations[0].frameIndex) {
// 						promoStore.setSequenceOpeningAnimationEnded(true);
// 					}
// 				}
// 			),
// 		[localStore, promoStore]
// 	);

// 	return (
// 		<S.TableBackground ref={containerRef}>
// 			<S.Canvas ref={mergeRefs(canvasResizeObserver.ref, handleCanvasRef)} />
// 		</S.TableBackground>
// 	);
// };

// const framesCount = 294;
// const sequence = imagesHelper.createImagesSequence(
// 	framesCount,
// 	(index) => `./images/table-sequence/${index + 1}.jpg`
// );

// sequence.preload();
