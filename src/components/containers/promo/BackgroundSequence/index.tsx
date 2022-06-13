import { useRef, useCallback, useEffect } from "react";
import { reaction, when } from "mobx";
import { a } from "react-spring";
import useAnimationFrame from "@phntms/use-animation-frame";

import { Iteration } from "@components/common/hoc/Iteration";

import { Image } from "@components/common/ui/Image";

import {
	useDebounce,
	useLocalStore,
	useGlobalStore,
	useResizeObserver,
	useIterationsControls,
} from "@core/hooks";
import { mergeRefs, drawImageCover } from "@core/utils";
import { Sequence } from "@core/classes";

import * as S from "./styled";
import { getRasterImageByName } from "@assets/images";

export const BackgroundSequence: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null!);
	const containerRef = useRef<HTMLDivElement>(null!);
	const contextRef = useRef<CanvasRenderingContext2D>(null!);
	const previousFrameRef = useRef<number>(null!);

	const canvasResizeObserver = useResizeObserver();
	const iterationsControls = useIterationsControls();
	const promoStore = useGlobalStore((store) => store.layout.promo);

	const localStore = useLocalStore({
		currentFrame: 0,
		openingAnimationEnded: false,
		neededFrame: null as number | null,
	});

	const handleCanvasRef = useCallback((element: HTMLCanvasElement | null) => {
		if (!element) return;

		canvasRef.current = element;
		contextRef.current = element.getContext("2d", { alpha: null }) as CanvasRenderingContext2D;
	}, []);

	const drawFrame = useCallback(
		(index: number, rerenderEnabled = false) => {
			const context = contextRef.current;
			const sequenceItem = SEQUENCE.items[index];
			const { width, height } = canvasResizeObserver.getSize();

			if (previousFrameRef.current === index && !rerenderEnabled && !sequenceItem.loaded) return;

			requestAnimationFrame(() =>
				drawImageCover(context, sequenceItem.image, 0, 0, width, height, 0.5, 0.5)
			);
			previousFrameRef.current = index;
		},
		[canvasResizeObserver]
	);

	const drawCurrentFrame = useCallback(
		(rerenderEnabled?: boolean) => {
			drawFrame(localStore.currentFrame, rerenderEnabled);
		},
		[drawFrame, localStore]
	);

	const updateNeededFrame = useCallback(
		(index: number) => {
			if (localStore.currentFrame === index) return;
			localStore.setNeededFrame(index);
		},
		[localStore]
	);

	const updateCurrentFrame = useCallback(
		(index: number) => {
			localStore.setCurrentFrame(index);
			promoStore.setSequenceFrame(index);
			promoStore.setSequenceProgress(index / SEQUENCE.amount);
			drawCurrentFrame();
		},
		[drawCurrentFrame, localStore, promoStore]
	);

	const updateCanvasSize = useDebounce(() => {
		const { width, height } = canvasResizeObserver.getSize();
		const dpr = window.devicePixelRatio;
		const canvas = canvasRef.current;
		const context = contextRef.current;

		canvas.width = width * dpr;
		canvas.height = height * dpr;

		context.scale(dpr, dpr);

		drawCurrentFrame(true);
	}, 100);

	const preloadSequence = useCallback(async () => {
		if (localStore.openingAnimationEnded) return;
		await SEQUENCE.preloadOne(0);
		drawCurrentFrame(true);
		await SEQUENCE.preload(0, ITERATIONS[0]);
		promoStore.setSequenceLoaded(true);
	}, [drawCurrentFrame, localStore, promoStore]);

	const preloadSequenceIteration = useCallback(async () => {
		const { currentFrame } = localStore;
		const currentIteration = ITERATIONS.reduce(
			(acc, iteration, index) =>
				iteration - Math.min(2 * FPS, iteration / 2) <= currentFrame ? index : acc,
			0
		);
		const nextIteration = Math.min(currentIteration + 1, ITERATIONS.length - 1);

		SEQUENCE.preload(ITERATIONS[currentIteration], ITERATIONS[nextIteration]);
	}, [localStore]);

	const updateFrameRelativeCurrentIteration = useCallback(() => {
		if (iterationsControls.store.iteration > ITERATIONS.length - 1) return;

		const currentIteration = Math.floor(iterationsControls.store.iteration);
		const nextIteration = Math.min(Math.floor(currentIteration + 1), ITERATIONS.length - 1);

		const startFrame = ITERATIONS[currentIteration];
		const endFrame = ITERATIONS[nextIteration];

		const progress = iterationsControls.store.toRange(
			currentIteration,
			nextIteration === 3 ? 2.5 : nextIteration
		);
		const diff = Math.abs(startFrame - endFrame);
		const frame = startFrame + Math.round(diff * progress);

		updateCurrentFrame(frame);
	}, [iterationsControls, updateCurrentFrame]);

	useAnimationFrame(() => {
		const { currentFrame, neededFrame } = localStore;

		if (neededFrame === null) return;
		if (neededFrame !== currentFrame) {
			const sign = Math.sign(neededFrame - currentFrame);
			const nextFrame = currentFrame + sign;

			updateCurrentFrame(nextFrame);
		}

		if (neededFrame === currentFrame) {
			localStore.setNeededFrame(null);
		}

		drawCurrentFrame();
	}, FPS);

	useEffect(
		() =>
			reaction(
				() => iterationsControls.store.progress,
				() => updateFrameRelativeCurrentIteration()
			),
		[iterationsControls, updateFrameRelativeCurrentIteration]
	);

	useEffect(
		() =>
			reaction(
				() => canvasResizeObserver.getSize(),
				() => updateCanvasSize()
			),
		[canvasResizeObserver, drawCurrentFrame, updateCanvasSize]
	);

	useEffect(
		() =>
			reaction(
				() => localStore.currentFrame,
				(currentFrame) => {
					// const roundedFrame = Math.floor(currentFrame);
					// SEQUENCE.preload(roundedFrame, roundedFrame + 15);
					preloadSequenceIteration();

					if (currentFrame >= ITERATIONS[0]) {
						promoStore.setSequenceOpeningAnimationEnded(true);
					}
				}
			),
		[localStore, preloadSequenceIteration, promoStore]
	);

	useEffect(
		() =>
			when(
				() => promoStore.canShowContent,
				() => updateNeededFrame(ITERATIONS[0])
			),
		[promoStore, updateNeededFrame]
	);

	useEffect(() => {
		preloadSequence();
	}, [preloadSequence]);

	return (
		<S.BackgroundSequence ref={containerRef}>
			<S.Canvas ref={mergeRefs(canvasResizeObserver.ref, handleCanvasRef)} />
		</S.BackgroundSequence>
	);
};

export const BackgroundFrame: React.FC = () => {
	return (
		<S.BackgroundFrame>
			{ITERATIONS.map((iterationFrame, index) => (
				<Iteration iterations={index} switchVisibility={false}>
					{([iteration], interpolations) => (
						<a.div
							style={{
								opacity:
									index === 0
										? 1
										: iteration.interpolations.opening
												.to(interpolations.range(0, 0.5))
												.to(interpolations.easing("easeInOutCubic")),
							}}>
							<Image src={getRasterImageByName(`MobileSequenceIteration${index + 1}` as any)} />
						</a.div>
					)}
				</Iteration>
			))}
		</S.BackgroundFrame>
	);
};

function formatSource(index: number) {
	return `https://ik.imagekit.io/64nah4dsw/slided/sequence/${String(index + 1).padStart(
		3,
		"0"
	)}.jpg`;
}

const FPS = 30;
const ITERATIONS = [115, 240, 380, 443];
const SEQUENCE = new Sequence(ITERATIONS[ITERATIONS.length - 1] + 1, formatSource);
