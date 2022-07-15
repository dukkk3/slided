import { useContext, useCallback, useEffect, createContext } from "react";
import useAnimationFrame from "@phntms/use-animation-frame";
import { Observer } from "mobx-react-lite";
import { reaction, when } from "mobx";
import { a } from "react-spring";

import { useIterationsControls } from "@components/providers/IterationsControlsProvider";

import { Image } from "@components/common/ui/Image";

import { useCanvasSequence } from "@core/hooks/useCanvasSequence";
import { useLocalStore } from "@core/hooks/useLocalStore";
import { useBreakpoint } from "@core/hooks/useBreakpoint";
import { ImageKitSequence } from "@core/classes/ImageKitSequence";
import { interpolations } from "@core/helpers/iteration.helper";

import { getRasterImageByName } from "@assets/images";

import { Iteration } from "../../helpers/Iteration";
import { usePromo } from "../../index";

import * as S from "./styled";

interface Context {
	store: {
		neededFrame: number | null;
		readonly sequenceAvailable: boolean | null;
		setNeededFrame: (value: number | null) => void;
	};
	canvasSequence: ReturnType<typeof useCanvasSequence>;
}

const context = createContext<Context>(null!);

export const Background: React.FC = () => {
	const promo = usePromo();
	const breakpoint = useBreakpoint();
	const canvasSequence = useCanvasSequence(SEQUENCE, { resizeObserverDebounce: 100 });

	const localStore = useLocalStore<Context["store"]>({
		neededFrame: null as number | null,
		setNeededFrame: function (value) {
			this.neededFrame = value;
		},
		get sequenceAvailable() {
			return !breakpoint.identified() ? null : !breakpoint.mobile() && !breakpoint.tablet();
		},
	});

	useEffect(
		() =>
			reaction(
				() => localStore.sequenceAvailable,
				(available) => {
					if (!available && available !== null) {
						promo.store.setSequenceCanPlay(true);
						promo.store.setBackgroundOpeningEnded(true);
					}
				}
			),
		[localStore, promo]
	);

	return (
		<context.Provider value={{ store: localStore, canvasSequence }}>
			<Observer>
				{() =>
					localStore.sequenceAvailable === null ? null : localStore.sequenceAvailable ? (
						<BackgroundDesktop />
					) : (
						<BackgroundMobile />
					)
				}
			</Observer>
		</context.Provider>
	);
};

const BackgroundDesktop: React.FC = () => {
	const promo = usePromo();
	const background = useContext(context);
	const iterationsControls = useIterationsControls();

	const updateNeededFrame = useCallback(
		(index: number) => {
			if (background.canvasSequence.getCurrentFrame() === index) return;
			background.store.setNeededFrame(index);
		},
		[background]
	);

	const updateCurrentFrame = useCallback(
		(index: number) => {
			background.canvasSequence.setCurrentFrame(index);
			background.canvasSequence.drawCurrentFrame();
		},
		[background]
	);

	const preloadSequenceIteration = useCallback(() => {
		const currentFrame = background.canvasSequence.getCurrentFrame();
		const currentIteration = ITERATIONS.reduce(
			(acc, iteration, index) =>
				iteration - Math.min(2 * FPS, iteration / 2) <= currentFrame ? index : acc,
			0
		);
		const nextIteration = Math.min(currentIteration + 1, ITERATIONS.length - 1);

		SEQUENCE.preload(ITERATIONS[currentIteration], ITERATIONS[nextIteration]);
	}, [background]);

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

	const preloadSequence = useCallback(async () => {
		if (promo.store.sequenceCanPlay || SEQUENCE.loaded()) {
			background.canvasSequence.drawCurrentFrame(true);
			promo.store.setSequenceCanPlay(true);
			return;
		}
		await SEQUENCE.preloadAll();
		background.canvasSequence.drawCurrentFrame(true);
		promo.store.setSequenceCanPlay(true);
	}, [background, promo]);

	useAnimationFrame(() => {
		const currentFrame = background.canvasSequence.getCurrentFrame();
		const { neededFrame } = background.store;

		if (neededFrame === null) return;
		if (neededFrame !== currentFrame) {
			const sign = Math.sign(neededFrame - currentFrame);
			const nextFrame = currentFrame + sign;
			updateCurrentFrame(nextFrame);
		}

		if (neededFrame === currentFrame) {
			background.store.setNeededFrame(null);
		}

		background.canvasSequence.drawCurrentFrame();
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
				() => background.canvasSequence.getCurrentFrame(),
				(currentFrame) => {
					preloadSequenceIteration();

					if (currentFrame >= ITERATIONS[0]) {
						promo.store.setBackgroundOpeningEnded(true);
					}
				}
			),
		[background, preloadSequenceIteration, promo]
	);

	useEffect(
		() =>
			when(
				() => promo.store.contentCanShow && !promo.store.backgroundOpeningEnded,
				() => updateNeededFrame(ITERATIONS[0])
			),
		[iterationsControls, promo, updateNeededFrame]
	);

	useEffect(() => {
		preloadSequence();

		if (promo.store.backgroundOpeningEnded) {
			updateFrameRelativeCurrentIteration();
		}
	}, [preloadSequence, promo, updateFrameRelativeCurrentIteration]);

	return (
		<S.BackgroundSequence>
			<S.Canvas ref={background.canvasSequence.ref} />
		</S.BackgroundSequence>
	);
};

const BackgroundMobile: React.FC = () => {
	return (
		<S.BackgroundFrame>
			{ITERATIONS.map((_, index) => (
				<Iteration key={index} iterations={index} visibilitySwitch={false}>
					{([iteration]) => (
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

const FPS = 25;
const ITERATIONS = [80, 160, 239, 283];
const SEQUENCE = new ImageKitSequence(ITERATIONS[ITERATIONS.length - 1] + 1, "table");

console.log(SEQUENCE.sources);
