import { useEffect, useRef } from "react";
import { a, config, useSpring } from "react-spring";
import { Observer } from "mobx-react-lite";
import { reaction } from "mobx";

import { SplitIntoChars } from "@components/common/simple/SplitIntoChars";

import { Image } from "@components/common/ui/Image";

import { useIteration, useIterationControls, useLocalStore, useResizeObserver } from "@core/hooks";
import { clamp, createArray, calculateElementOffset } from "@core/utils";

import { getRasterImageByName } from "@assets/images";
import { getVideoByName } from "@assets/videos";

import * as S from "./styled";

const CIRCLE_RADIUS = 45.5;
const CIRCLE_VIEW_BOX_SIZE = 100;
const CIRCLE_CIRCUMFERENCE = Math.PI * (CIRCLE_RADIUS * 2);
const CIRCLE_CENTER = CIRCLE_VIEW_BOX_SIZE / 2;

export const AssistantLayer: React.FC = () => {
	const iterationControls = useIterationControls();
	const endFaceContainerResizeObserver = useResizeObserver();
	const startFaceContainerResizeObserver = useResizeObserver();
	const localStore = useLocalStore({ facePulseAnimated: false });
	const assistantFaceTargetProps = useRef({ scaleX: 0, scaleY: 0, y: 0 });

	// const {
	// 	interpolations: [opening1Value, closing1Value],
	// } = useIteration(1);

	const openingIteration1InterpolatedValue = iterationControls.animated.toRange(0.5, 1);
	const closingIteration1InterpolatedValue = iterationControls.animated.toRange(1, 1.5);

	const openingIteration2InterpolatedValue = iterationControls.animated.toRange(1.5, 2);
	const closingIteration2InterpolatedValue = iterationControls.animated.toRange(2, 2.5);

	const openingIteration3InterpolatedValue = iterationControls.animated.toRange(2.5, 3);
	const closingIteration3InterpolatedValue = iterationControls.animated.toRange(3, 3.5);

	const openingIteration4InterpolatedValue = iterationControls.animated.toRange(3.5, 4);
	const closingIteration4InterpolatedValue = iterationControls.animated.toRange(4, 4.5);

	const [facePulseStyle, facePulseApi] = useSpring(() => ({ scale: 0 }));
	const [assistantFaceStyle, assistantFaceApi] = useSpring(() => ({ scaleX: 1, scaleY: 1, y: 0 }));

	useEffect(
		() =>
			reaction(
				() =>
					[
						iterationControls.store.inRange(2.5, Infinity),
						iterationControls.store.toRange(2.5, 3),
					] as const,
				([inRange, range]) => {
					if (inRange) {
						const { scaleX, scaleY, y } = assistantFaceTargetProps.current;
						assistantFaceApi.set({
							scaleX: 1 + (scaleX - 1) * range,
							scaleY: 1 + (scaleY - 1) * range,
							y: y * range,
						});
					} else {
						assistantFaceApi.set({ scaleX: 1, scaleY: 1, y: 0 });
					}
				}
			),
		[iterationControls, assistantFaceApi]
	);

	useEffect(
		() =>
			reaction(
				() =>
					[
						startFaceContainerResizeObserver.getSize(),
						endFaceContainerResizeObserver.getSize(),
					] as const,
				([startFaceSize, endFaceSize]) => {
					const startFaceOffset = calculateElementOffset(startFaceContainerResizeObserver.ref.current);
					const endFaceOffset = calculateElementOffset(endFaceContainerResizeObserver.ref.current);

					const scaleX = endFaceSize.width / startFaceSize.width;
					const scaleY = endFaceSize.height / startFaceSize.height;

					const y =
						endFaceOffset.top - startFaceOffset.top + (endFaceSize.height - startFaceSize.height) / 2;

					assistantFaceTargetProps.current = {
						scaleX,
						scaleY,
						y,
					};
				}
			),
		[startFaceContainerResizeObserver, endFaceContainerResizeObserver]
	);

	useEffect(
		() =>
			reaction(
				() =>
					iterationControls.store.inRange(0.5, Infinity) && iterationControls.store.toRange(0.5, 1) >= 1,
				(animated) => {
					if (animated) {
						facePulseApi.start({
							to: { scale: 1 },
							from: { scale: 0 },
							loop: { reverse: true },
							config: config.gentle,
						});
					} else {
						facePulseApi.stop();
						facePulseApi.set({ scale: 0 });
					}

					localStore.setFacePulseAnimated(animated);
				}
			),
		[facePulseApi, iterationControls, localStore]
	);

	return (
		<S.AssistantLayer>
			<Observer>
				{() => (
					<S.Layer
						style={
							iterationControls.store.inRange(2.5, Infinity)
								? { opacity: 1, pointerEvents: "auto" }
								: { opacity: 0, pointerEvents: "none" }
						}>
						<S.MobilePhoneContainer>
							<S.MobilPhonePlug
								style={{
									y: openingIteration3InterpolatedValue.to((value) => `-${50 * (1 - value)}%`),
									opacity: openingIteration3InterpolatedValue,
								}}
							/>
							<S.MobilePhoneContent>
								<S.MobilPhoneAssistantFaceContainer
									ref={endFaceContainerResizeObserver.ref}></S.MobilPhoneAssistantFaceContainer>
								<S.MobilePhoneDescription>
									<Observer>
										{() =>
											iterationControls.store.inRange(2.5, Infinity) ? (
												<S.DescriptionContent>
													<SplitIntoChars text={["Choose a style", "from ready-made", "templates"]}>
														{({ char, count, absoluteIndex }) => (
															<a.span
																className='animated-inline-unit'
																style={{
																	opacity: iterationControls.store.inRange(2.5, Infinity)
																		? openingIteration3InterpolatedValue.to((value) =>
																				iterationControls.range(value, absoluteIndex / count, 1)
																		  )
																		: openingIteration4InterpolatedValue.to((value) => 1 - value),
																}}>
																{char}
															</a.span>
														)}
													</SplitIntoChars>
												</S.DescriptionContent>
											) : null
										}
									</Observer>
								</S.MobilePhoneDescription>
								<Observer>
									{() =>
										iterationControls.store.inRange(2.5, Infinity) ? (
											<S.MobilePhoneCardsWrapper>
												{createArray(CARDS_COUNT).map((_, index) => {
													const { center, offset, norm, sign } = getCardPayload(index);
													return (
														<S.MobilePhoneCard
															key={index}
															style={{
																translateZ: -5 * norm,
																zIndex: center - offset,
																rotateY: -0.25 * norm * sign,
																opacity: openingIteration3InterpolatedValue,
																translateX: iterationControls.store.inRange(2.5, 3.5)
																	? openingIteration3InterpolatedValue.to(
																			(value) => `${200 * norm * sign + 120 * norm * sign * (1 - value)}%`
																	  )
																	: openingIteration4InterpolatedValue.to(
																			(value) => `${200 * norm * sign * (1 - value)}%`
																	  ),
																scale: openingIteration3InterpolatedValue.to((value) => value),
															}}>
															<Image src={templates[index]} lazy={false} />
														</S.MobilePhoneCard>
													);
												})}
											</S.MobilePhoneCardsWrapper>
										) : null
									}
								</Observer>
							</S.MobilePhoneContent>
						</S.MobilePhoneContainer>
					</S.Layer>
				)}
			</Observer>
			<S.Layer>
				<S.AssistantFaceContainer ref={startFaceContainerResizeObserver.ref}>
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
												: { scale: openingIteration1InterpolatedValue }
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
										strokeDashoffset={openingIteration1InterpolatedValue.to((value) =>
											getCircleStrokeDashoffset(value * 100)
										)}
									/>
								</svg>
							</S.AssistantFaceCircle>
						</S.AssistantFaceBackground>
						<S.AssistantFaceContentLayer>
							<S.AssistantFaceVideoWrapper style={{ scale: openingIteration1InterpolatedValue }}>
								<a.video
									src={getVideoByName("BasicGirlSource")}
									muted
									loop
									autoPlay
									playsInline
									style={{ scale: openingIteration1InterpolatedValue.to((value) => 1 / value) }}
								/>
							</S.AssistantFaceVideoWrapper>
						</S.AssistantFaceContentLayer>
					</S.AssistantFace>
				</S.AssistantFaceContainer>
				<S.Description>
					<S.DescriptionContent>
						<Observer>
							{() =>
								iterationControls.store.inRange(0.5, 1.5) ? (
									<SplitIntoChars text={["Let’s see how it works.", "Upload your content."]}>
										{({ char, absoluteIndex, count }) => (
											<a.span
												className='animated-inline-unit'
												style={{
													opacity: iterationControls.store.inRange(0.5, 1)
														? openingIteration1InterpolatedValue.to((value) =>
																iterationControls.range(value, absoluteIndex / count, 1)
														  )
														: closingIteration1InterpolatedValue.to((value) => 1 - value),
												}}>
												{char}
											</a.span>
										)}
									</SplitIntoChars>
								) : null
							}
						</Observer>
					</S.DescriptionContent>
					<S.DescriptionContent>
						<Observer>
							{() =>
								iterationControls.store.inRange(1.5, 2.5) ? (
									<SplitIntoChars text={["I’m here to organize it all", "into a neat structure"]}>
										{({ char, absoluteIndex, count }) => (
											<a.span
												className='animated-inline-unit'
												style={{
													opacity: iterationControls.store.inRange(1.5, 2)
														? openingIteration2InterpolatedValue.to((value) =>
																iterationControls.range(value, absoluteIndex / count, 1)
														  )
														: closingIteration2InterpolatedValue.to((value) => 1 - value),
												}}>
												{char}
											</a.span>
										)}
									</SplitIntoChars>
								) : null
							}
						</Observer>
					</S.DescriptionContent>
				</S.Description>
			</S.Layer>
		</S.AssistantLayer>
	);
};

function getCircleStrokeDashoffset(progress: number) {
	return ((100 - clamp(progress, 0, 100)) / 100) * CIRCLE_CIRCUMFERENCE;
}

const templates = [
	getRasterImageByName("BeigeTemplateSource"),
	getRasterImageByName("BrightTemplateSource"),
	getRasterImageByName("BlueTemplateSource"),
	getRasterImageByName("GreenTemplateSource"),
	getRasterImageByName("SilverTemplateSource"),
];

const CARDS_COUNT = templates.length;

function getCardPayload(index: number) {
	const center = Math.ceil(CARDS_COUNT / 2) - 1;
	const offset = Math.abs(index - center);
	const sign = Math.sign(index - center);
	const norm = offset / center;
	return { center, offset, sign, norm };
}
