// import { useRef, useCallback, useEffect } from "react";
// import { transaction, reaction } from "mobx";
// import useAnimationFrame from "@phntms/use-animation-frame";

// import {
// 	useLocalStore,
// 	useGlobalStore,
// 	useResizeObserver,
// 	useIterationsControls,
// } from "@core/hooks";
// import { drawImageCover, mergeRefs } from "@core/utils";
// import { imagesHelper } from "@core/helpers";

// import * as S from "./styled";

// const iterations: { frameIndex: number }[] = [
// 	{ frameIndex: 110 },
// 	{ frameIndex: 235 },
// 	{ frameIndex: 365 },
// 	{ frameIndex: 391 },
// ];

// export const TableSequence: React.FC = () => {
// 	const canvasRef = useRef<HTMLCanvasElement>(null!);
// 	const contextRef = useRef<CanvasRenderingContext2D>(null!);
// 	const containerRef = useRef<HTMLDivElement>(null);
// 	const loadedFramesRef = useRef(new Set<number>());
// 	const prevRenderedFrameIndexRef = useRef<number>(null!);

// 	const promoStore = useGlobalStore((store) => store.layout.promo);
// 	const iterationsControls = useIterationsControls();
// 	const canvasResizeObserver = useResizeObserver();
// 	const localStore = useLocalStore({
// 		animated: false,
// 		firstIterationLoaded: false,
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

// 	const iterationFramesLoaded = useCallback((iteration: number) => {
// 		const { frameIndex: startFrameIndex } =
// 			iteration === 0 ? { frameIndex: 0 } : iterations[iteration - 1];
// 		const { frameIndex: endFrameIndex } = iterations[iteration];

// 		let loaded = true;

// 		for (let i = startFrameIndex; i <= endFrameIndex; i++) {
// 			if (!loadedFramesRef.current.has(i)) loaded = false;
// 		}

// 		return loaded;
// 	}, []);

// 	const handleFrameLoad = useCallback(
// 		(index: number) => {
// 			loadedFramesRef.current.add(index);

// 			if (iterationFramesLoaded(0)) {
// 				promoStore.setVideoLoaded(true);
// 			}
// 		},
// 		[iterationFramesLoaded, promoStore]
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
// 		sequence.preload(handleFrameLoad);
// 		console.log(sequence.getSequence());
// 	}, [handleFrameLoad]);

// 	useEffect(
// 		() =>
// 			reaction(
// 				() => promoStore.canShowContent,
// 				(canShowContent) => {
// 					if (!canShowContent) return;
// 					updateTargetFrameIndex(iterations[0].frameIndex);
// 				}
// 			),
// 		[promoStore, updateTargetFrameIndex]
// 	);

// 	useEffect(
// 		() =>
// 			reaction(
// 				() => iterationsControls.store.toRange(0, iterations.length - 1),
// 				(progress) => {
// 					if (!promoStore.interactiveEnabled) return;

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
// 					console.log({ animated, currentFrameIndex });
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

// const framesCount = iterations[iterations.length - 1].frameIndex + 1;
// const sequence = imagesHelper.createImagesSequence(
// 	framesCount,
// 	(index) =>
// 		`https://ik.imagekit.io/64nah4dsw/slided/sequence/${String(index + 1).padStart(3, "0")}.jpg`
// );
export {};
