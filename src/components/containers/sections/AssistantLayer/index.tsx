import { useEffect } from "react";
import { a, config, useSpring } from "react-spring";
import { Observer } from "mobx-react-lite";
import { reaction } from "mobx";

import { VisibleIterationRange } from "@components/common/hoc/VisibleIterationRange";

import { SplitIntoChars } from "@components/common/simple/SplitIntoChars";

import {
	useIteration,
	useLocalStore,
	useGlobalStore,
	useResizeObserver,
	useIterationControls,
} from "@core/hooks";
import { clamp, calculateElementOffset, calculateCoord, calculateScale } from "@core/utils";

import { getVideoByName } from "@assets/videos";

import * as S from "./styled";

const CIRCLE_RADIUS = 45.5;
const CIRCLE_VIEW_BOX_SIZE = 100;
const CIRCLE_CIRCUMFERENCE = Math.PI * (CIRCLE_RADIUS * 2);
const CIRCLE_CENTER = CIRCLE_VIEW_BOX_SIZE / 2;

export const AssistantLayer: React.FC = () => {
	const iterationControls = useIterationControls();
	const faceResizeObserver = useResizeObserver();
	const localStore = useLocalStore({
		facePulseAnimated: false,
	});
	const promoStore = useGlobalStore((store) => store.layout.promo);

	const iteration1 = useIteration(1);
	const iteration2 = useIteration(2);
	const iteration3 = useIteration(3);
	const iteration5 = useIteration(5);
	const iteration6 = useIteration(6);

	const [facePulseStyle, facePulseApi] = useSpring(() => ({ scale: 0 }));
	const [assistantFaceStyle, assistantFaceApi] = useSpring(() => ({
		scaleX: 1,
		scaleY: 1,
		x: 0,
		y: 0,
	}));

	useEffect(
		() =>
			reaction(
				() => faceResizeObserver.getSize(),
				(size) => {
					const offset = calculateElementOffset(faceResizeObserver.ref.current);
					promoStore.setFaceStyles({ ...size, ...offset });
				}
			),
		[faceResizeObserver, promoStore]
	);

	useEffect(
		() =>
			reaction(
				() =>
					[
						iterationControls.store.compare(iteration3.start, "lte"),
						promoStore.faceStyles,
						promoStore.minFaceStyles,
						promoStore.minFaceWithExecutorStyles,
						iteration3.ranges.opening(),
						iteration5.ranges.closing(),
					] as const,
				([
					started,
					faceStyles,
					minFaceStyles,
					minFaceWithExecutorStyles,
					iteration3OpeningProgress,
					iteration5ClosingProgress,
				]) => {
					let y = 0;
					let x = 0;
					let scaleX = 1;
					let scaleY = 1;

					if (started) {
						const inRangeBtw3And5 = iterationControls.store.inRange(iteration3.start, iteration5.start);

						if (inRangeBtw3And5) {
							x = calculateCoord(
								faceStyles.left,
								minFaceStyles.left,
								faceStyles.width,
								minFaceStyles.width
							);
							y = calculateCoord(
								faceStyles.top,
								minFaceStyles.top,
								faceStyles.height,
								minFaceStyles.height
							);
							scaleX = calculateScale(minFaceStyles.width, faceStyles.width);
							scaleY = calculateScale(minFaceStyles.height, faceStyles.height);

							x *= iteration3OpeningProgress;
							y *= iteration3OpeningProgress;
							scaleX = 1 + (scaleX - 1) * iteration3OpeningProgress;
							scaleY = 1 + (scaleY - 1) * iteration3OpeningProgress;
						} else {
							const xStart = calculateCoord(
								faceStyles.left,
								minFaceStyles.left,
								faceStyles.width,
								minFaceStyles.width
							);
							const yStart = calculateCoord(
								faceStyles.top,
								minFaceStyles.top,
								faceStyles.height,
								minFaceStyles.height
							);
							const scaleXStart = calculateScale(minFaceStyles.width, faceStyles.width);
							const scaleYStart = calculateScale(minFaceStyles.height, faceStyles.height);

							x = calculateCoord(
								minFaceStyles.left,
								minFaceWithExecutorStyles.left,
								minFaceStyles.width,
								minFaceWithExecutorStyles.width
							);
							y = calculateCoord(
								minFaceStyles.top,
								minFaceWithExecutorStyles.top,
								minFaceStyles.height,
								minFaceWithExecutorStyles.height
							);

							scaleX = calculateScale(minFaceStyles.width, minFaceWithExecutorStyles.width);
							scaleY = calculateScale(minFaceStyles.height, minFaceWithExecutorStyles.height);

							x = xStart + x * iteration5ClosingProgress;
							y = yStart + y * iteration5ClosingProgress;
							scaleX = scaleXStart + (1 - scaleX) * iteration5ClosingProgress;
							scaleY = scaleYStart + (1 - scaleY) * iteration5ClosingProgress;
						}
					}

					assistantFaceApi.set({ scaleX, scaleY, x, y });
				}
			),
		[iteration3, iteration5, iteration6, promoStore, assistantFaceApi, iterationControls]
	);

	useEffect(
		() =>
			reaction(
				() =>
					iterationControls.store.compare(iteration1.start, "lte") && iteration1.ranges.opening() >= 1,
				(animated, prevAnimated) => {
					if (animated === prevAnimated) return;

					localStore.setFacePulseAnimated(animated);

					if (animated) {
						facePulseApi.start({
							to: { scale: 1 },
							from: { scale: 0 },
							loop: { reverse: true },
							config: config.gentle,
						});
					} else {
						facePulseApi.stop().set({ scale: 0 });
					}
				}
			),
		[facePulseApi, iteration1, iterationControls, localStore]
	);

	return (
		<S.AssistantLayer>
			<S.Layer>
				<S.AssistantFaceContainer ref={faceResizeObserver.ref}>
					<S.AssistantFace style={assistantFaceStyle}>
						<S.AssistantFaceBackground>
							<Observer>
								{() => (
									<S.AssistantFacePulse
										style={
											localStore.facePulseAnimated
												? {
														scale: facePulseStyle.scale.to({
															range: [0, 0.25, 0.5, 0.75, 1],
															output: [1, 1.1, 1.05, 1.1, 1],
														}),
												  }
												: { scale: iteration1.interpolations.opening }
										}
									/>
								)}
							</Observer>
							<S.AssistantFaceCircle>
								<svg viewBox={`0 0 ${CIRCLE_VIEW_BOX_SIZE} ${CIRCLE_VIEW_BOX_SIZE}`}>
									<a.circle
										cx={CIRCLE_CENTER}
										cy={CIRCLE_CENTER}
										r={CIRCLE_RADIUS}
										strokeDasharray={CIRCLE_CIRCUMFERENCE}
										strokeDashoffset={iteration1.interpolations.opening.to((value) =>
											getCircleStrokeDashoffset(value * 100)
										)}
									/>
								</svg>
							</S.AssistantFaceCircle>
						</S.AssistantFaceBackground>
						<S.AssistantFaceContentLayer>
							<S.AssistantFaceVideoWrapper
								className='safari-border-radius-overflow-bugfix'
								style={{ scale: iteration1.interpolations.opening }}>
								<a.video
									src={getVideoByName("BasicGirlSource")}
									muted
									loop
									autoPlay
									playsInline
									style={{ scale: iteration1.interpolations.opening.to((value) => 1 / value) }}
								/>
							</S.AssistantFaceVideoWrapper>
						</S.AssistantFaceContentLayer>
					</S.AssistantFace>
				</S.AssistantFaceContainer>
				<VisibleIterationRange start={iteration1.start} end={iteration2.end}>
					<S.Description>
						<VisibleIterationRange start={iteration1.start} end={iteration1.end}>
							<S.DescriptionContent>
								<Observer>
									{() => (
										<SplitIntoChars
											text={["Let’s see how it works.", "Upload your content."]}
											rerenderFlag={iterationControls.store.inRange(iteration1.start, iteration1.center)}>
											{({ char, count, absoluteIndex }) => (
												<a.span
													style={{
														opacity: iterationControls.store.inRange(iteration1.start, iteration1.center)
															? iteration1.interpolations.opening.to((value) =>
																	iterationControls.range(value, absoluteIndex / (count - 1), 1)
															  )
															: iteration1.interpolations.closing.to((value) => 1 - value),
													}}>
													{char}
												</a.span>
											)}
										</SplitIntoChars>
									)}
								</Observer>
							</S.DescriptionContent>
						</VisibleIterationRange>
						<VisibleIterationRange start={iteration2.start} end={iteration2.end}>
							<S.DescriptionContent>
								<Observer>
									{() => (
										<SplitIntoChars
											text={["I’m here to organize it all", "into a neat structure"]}
											rerenderFlag={iterationControls.store.inRange(
												iteration2.start,
												iteration2.fromStartCenter
											)}>
											{({ char, count, absoluteIndex }) => (
												<a.span
													style={{
														opacity: iterationControls.store.inRange(iteration2.start, iteration2.fromStartCenter)
															? iteration2.interpolations.opening.to((value) =>
																	iterationControls.range(value, absoluteIndex / count, 1)
															  )
															: iteration2.interpolations.closing.to((value) => 1 - value),
													}}>
													{char}
												</a.span>
											)}
										</SplitIntoChars>
									)}
								</Observer>
							</S.DescriptionContent>
						</VisibleIterationRange>
					</S.Description>
				</VisibleIterationRange>
			</S.Layer>
		</S.AssistantLayer>
	);
};

function getCircleStrokeDashoffset(progress: number) {
	return ((100 - clamp(progress, 0, 100)) / 100) * CIRCLE_CIRCUMFERENCE;
}
