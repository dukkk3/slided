import { useContext, useCallback, useEffect, createContext } from "react";
import useAnimationFrame from "@phntms/use-animation-frame";
import { Observer } from "mobx-react-lite";
import { reaction, when } from "mobx";
import { a } from "react-spring";

import { Iteration } from "@components/common/hoc/Iteration";

import { Image } from "@components/common/ui/Image";

import { useIterationsControls } from "@core/hooks/useIterationsControls";
import { useCanvasSequence } from "@core/hooks/useCanvasSequence";
import { useLocalStore } from "@core/hooks/useLocalStore";
import { useBreakpoint } from "@core/hooks/useBreakpoint";
import { Sequence } from "@core/classes/Sequence";
import { interpolations } from "@core/helpers/iteration.helper";

import { getRasterImageByName } from "@assets/images";

import { context as promoContext } from "../../index";

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
	const breakpoint = useBreakpoint();
	const promoStore = useContext(promoContext);
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
						promoStore.store.setSequenceLoaded(true);
						promoStore.store.setBackgroundAnimationEnded(true);
					}
				}
			),
		[localStore, promoStore]
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
	const background = useContext(context);
	const promoStore = useContext(promoContext);
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

	const preloadSequence = useCallback(async () => {
		console.log(promoStore.store.sequenceLoaded);
		if (promoStore.store.sequenceLoaded) return;
		await SEQUENCE.preloadOne(0);
		background.canvasSequence.drawCurrentFrame(true);
		await SEQUENCE.preload(0, ITERATIONS[0]);
		promoStore.store.setSequenceLoaded(true);
	}, [background, promoStore]);

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
						promoStore.store.setBackgroundAnimationEnded(true);
					}
				}
			),
		[background, preloadSequenceIteration, promoStore]
	);

	useEffect(
		() =>
			when(
				() => promoStore.store.canShowContent && !promoStore.store.backgroundAnimationEnded,
				() => updateNeededFrame(ITERATIONS[0])
			),
		[iterationsControls, promoStore, updateNeededFrame]
	);

	useEffect(() => {
		preloadSequence();
	}, [preloadSequence]);

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

function formatSource(index: number) {
	return `https://ik.imagekit.io/64nah4dsw/slided/slided_20/${String(index + 1).padStart(
		3,
		"0"
	)}.jpg`;
}

const FPS = 25;
const ITERATIONS = [80, 160, 239, 283];
const SEQUENCE = new Sequence(ITERATIONS[ITERATIONS.length - 1] + 1, formatSource);
