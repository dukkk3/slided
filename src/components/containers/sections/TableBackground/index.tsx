import { useCallback, useEffect, useRef } from "react";
import { reaction, transaction } from "mobx";
import useAnimationFrame from "@phntms/use-animation-frame";

import { useLocalStore, useGlobalStore, useResizeObserver } from "@core/hooks";
import { drawImageCover, mergeRefs } from "@core/utils";
import { imagesHelper } from "@core/helpers";

import * as S from "./styled";

const iterations: { frameIndex: number }[] = [
	{ frameIndex: 95 },
	{ frameIndex: 177 },
	{ frameIndex: 275 },
	{ frameIndex: 293 },
];

export const TableBackground: React.FC = () => {
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
			const { currentFrameIndex } = localStore;

			if (currentFrameIndex === index) return;

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
		updateTargetFrameIndex(iterations[0].frameIndex);
		// localStore.setCurrentFrameIndex(iterations[0].frameIndex);
		// drawCurrentFrame();
	}, [drawCurrentFrame, localStore, updateTargetFrameIndex]);

	useEffect(
		() =>
			reaction(
				() => [localStore.animated, localStore.currentFrameIndex],
				([animated, currentFrameIndex]) => {
					if (!animated && currentFrameIndex >= iterations[0].frameIndex) {
						promoStore.setSequenceOpeningAnimationEnded(true);
					}
				}
			),
		[localStore, promoStore]
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
