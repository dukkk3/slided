import { useCallback, useEffect } from "react";
import { reaction, transaction, when } from "mobx";
import { a } from "react-spring";
import useAnimationFrame from "@phntms/use-animation-frame";

import { Iteration } from "@components/common/hoc/Iteration";

import { Image } from "@components/common/ui/Image";

import {
	useLocalStore,
	useGlobalStore,
	useCanvasSequence,
	useIterationsControls,
} from "@core/hooks";
import { Sequence } from "@core/classes";

import { getRasterImageByName } from "@assets/images";

import * as S from "./styled";

export const BackgroundSequence: React.FC = () => {
	const iterationsControls = useIterationsControls();
	const promoStore = useGlobalStore((store) => store.layout.promo);
	const canvasSequence = useCanvasSequence(SEQUENCE, { resizeObserverDebounce: 100 });

	const localStore = useLocalStore({
		openingAnimationEnded: false,
		neededFrame: null as number | null,
	});

	const updateNeededFrame = useCallback(
		(index: number) => {
			if (canvasSequence.getCurrentFrame() === index) return;
			localStore.setNeededFrame(index);
		},
		[canvasSequence, localStore]
	);

	const updateCurrentFrame = useCallback(
		(index: number) => {
			transaction(() => {
				promoStore.setSequenceFrame(index);
				canvasSequence.setCurrentFrame(index);
				promoStore.setSequenceProgress(index / SEQUENCE.amount);
			});
			canvasSequence.drawCurrentFrame();
		},
		[canvasSequence, promoStore]
	);

	const preloadSequence = useCallback(async () => {
		if (localStore.openingAnimationEnded) return;
		await SEQUENCE.preloadOne(0);
		canvasSequence.drawCurrentFrame(true);
		await SEQUENCE.preload(0, ITERATIONS[0]);
		promoStore.setSequenceLoaded(true);
	}, [canvasSequence, localStore, promoStore]);

	const preloadSequenceIteration = useCallback(() => {
		const currentFrame = canvasSequence.getCurrentFrame();
		const currentIteration = ITERATIONS.reduce(
			(acc, iteration, index) =>
				iteration - Math.min(2 * FPS, iteration / 2) <= currentFrame ? index : acc,
			0
		);
		const nextIteration = Math.min(currentIteration + 1, ITERATIONS.length - 1);

		SEQUENCE.preload(ITERATIONS[currentIteration], ITERATIONS[nextIteration]);
	}, [canvasSequence]);

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
		const currentFrame = canvasSequence.getCurrentFrame();
		const { neededFrame } = localStore;

		if (neededFrame === null) return;
		if (neededFrame !== currentFrame) {
			const sign = Math.sign(neededFrame - currentFrame);
			const nextFrame = currentFrame + sign;
			updateCurrentFrame(nextFrame);
		}

		if (neededFrame === currentFrame) {
			localStore.setNeededFrame(null);
		}

		canvasSequence.drawCurrentFrame();
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
				() => canvasSequence.getCurrentFrame(),
				(currentFrame) => {
					// const roundedFrame = Math.floor(currentFrame);
					// SEQUENCE.preload(roundedFrame, roundedFrame + 15);
					preloadSequenceIteration();

					if (currentFrame >= ITERATIONS[0]) {
						promoStore.setSequenceOpeningAnimationEnded(true);
					}
				}
			),
		[canvasSequence, localStore, preloadSequenceIteration, promoStore]
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
		<S.BackgroundSequence>
			<S.Canvas ref={canvasSequence.ref} />
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
