import { useEffect } from "react";

import { springUtils } from "@shared/helpers";
import { math } from "@shared/utils";

import { TextAnimation } from "../../text-animation";

import * as model from "./iteration-3-8.model";
import * as S from "./iteration-3-8.styled";

export interface Iteration3_8Props {
	templatesSources: string[];
}

export const Iteration3_8 = ({ templatesSources }: Iteration3_8Props) => {
	useEffect(
		() =>
			when(
				() => iteration3.opened(),
				() => localStore.setCardsWereShown(true)
			),
		[iteration3, localStore]
	);

	return (
		<S.PhoneWrapper
			style={{
				opacity: model.iteration7.opening.progress
					.to(math.toStep(0.45))
					.to(springUtils.toEase("easeInOutCubic"))
					.to(math.invert),
			}}>
			<Phone
				ref={ref}
				openingInterpolation={model.iteration3.opening.progress.to(
					springUtils.toEase("easeInOutCubic")
				)}>
				<S.Content>
					<div>
						<S.FaceContainer>
							<S.FaceWrapper
								ref={mergeRefs(
									promo.transforms.bigAssistantAndPhoneAssistant.endRef,
									promo.transforms.phoneAssistantAndShiftedAssistant.startRef
								)}
							/>
							<S.FaceWrapper
								ref={promo.transforms.phoneAssistantAndShiftedAssistant.endRef}
								style={{ transform: "translateX(-40%)" }}
							/>
							<S.FaceWrapper
								ref={promo.transforms.executorAndPhoneExecutor.endRef}
								style={{ transform: "translateX(40%)" }}
							/>
						</S.FaceContainer>
						<S.DescriptionGroup>
							<S.Description>
								<TextAnimation
									words={["Choose a style", "from ready-made", "templates"]}
									openingProgress={model.iteration3.opening.progress.to(
										springUtils.toEase("easeInOutCubic")
									)}
									closingProgress={model.iteration4.closing.progress.to(
										springUtils.toEase("easeInOutCubic")
									)}
									type={iteration3.visible() || iteration4.visible("opening") ? "opening" : "closing"}
								/>
							</S.Description>
							<S.Description $overlay>
								<TextAnimation
									words={["Our selected", "designers are on", "the mission to get", "your task done"]}
									openingProgress={model.iteration5.opening.progress
										.to(interpolations.defaultDuration(iteration5.durationFactorOpening))
										.to(springUtils.toEase("easeInOutCubic"))}
									closingProgress={model.iteration5.opening.closing
										.to(interpolations.defaultDuration(iteration5.durationFactorClosing))
										.to(springUtils.toEase("easeInOutCubic"))}
									type={iteration5.currentState()}
								/>
							</S.Description>
							<VisibilitySwitch visible={iteration6.started() && !iteration7.ended()}>
								<S.Description $overlay $big>
									<TextAnimation
										words={["Designer is set", "& ready to start"]}
										openingProgress={model.iteration6.opening.progress.to(
											springUtils.toEase("easeInOutCubic")
										)}
										closingProgress={model.iteration6.closing.progress.to(() => 0)}
										type={iteration6.currentState()}
									/>
								</S.Description>
							</VisibilitySwitch>
						</S.DescriptionGroup>
					</div>
					<S.CardsGroup ref={promo.resizeObservers.phoneCardsContainer.ref}>
						<Observer>
							{() => (
								<S.RayImageGroup
									style={{
										opacity: iteration6.interpolations.opening.to(interpolations.easing("easeInOutCubic")),
									}}>
									{getVectorImageByName("common", "Ray")}
								</S.RayImageGroup>
							)}
						</Observer>
						<S.Cards
							style={{
								opacity: iteration4.interpolations.closing
									.to(interpolations.easing("easeInOutCubic"))
									.to(interpolations.invert),
								y: iteration4.interpolations.closing
									.to(interpolations.easing("easeInOutCubic"))
									.to((value) => `${2 * value}rem`),
							}}>
							<Observer>
								{() => (
									<S.TemplatesCards>
										{templatesSources
											.map((templateSource, index) => ({
												templateSource,
												...getCardProps(index, templatesSources.length),
											}))
											.map(({ templateSource, center, offset, sign, normalizedIndex }, index) => (
												<S.Card
													key={index}
													className={localStore.cardsWereShown ? "safari-border-radius-overflow-bugfix" : ""}
													style={getCardStyle({
														type: breakpoint.mobile() ? "mobile" : "desktop",
														iteration3,
														cardsAmount: templatesSources.length,
														cardProps: { center, offset, sign, normalizedIndex, index },
													})}>
													<S.CardImageWrapper
														style={{
															scale:
																index === center
																	? iteration4.interpolations.opening
																			.to(interpolations.easing("easeInOutCubic"))
																			.to(interpolations.invert)
																			.to((value) => 1 + 0.4 * value)
																	: 1,
														}}>
														<Image src={templateSource} lazy={false} />
													</S.CardImageWrapper>
												</S.Card>
											))}
									</S.TemplatesCards>
								)}
							</Observer>
						</S.Cards>
					</S.CardsGroup>
					<Observer>
						{() => (
							<S.ButtonWrapper>
								<VisibilitySwitch
									visible={iteration3.closeStarted() && !iteration4.ended()}
									unmountWhenInvisible>
									<a.div
										className='unit'
										style={{
											opacity: iteration3.visible()
												? iteration3.interpolations.closing.to(interpolations.easing("easeInOutCubic"))
												: iteration4.interpolations.closing
														.to(interpolations.range(0, 0.5))
														.to(interpolations.easing("easeInOutCubic"))
														.to(interpolations.invert),
										}}>
										<Button>Choose</Button>
									</a.div>
								</VisibilitySwitch>
								<VisibilitySwitch
									visible={iteration4.closeStarted() && !iteration5.ended()}
									unmountWhenInvisible>
									<Observer>
										{() =>
											!breakpoint.mobile() ? (
												<div>
													<a.div
														className='unit'
														style={{
															opacity: iteration4.visible("closing")
																? iteration4.interpolations.closing
																		.to(interpolations.range(0, 0.5))
																		.to(interpolations.easing("easeInOutCubic"))
																: iteration5.interpolations.closing
																		.to(interpolations.easing("easeInOutCubic"))
																		.to(interpolations.invert),
														}}>
														<Button theme='grey' disabled>
															Searching the best...
														</Button>
													</a.div>
												</div>
											) : null
										}
									</Observer>
								</VisibilitySwitch>
								<VisibilitySwitch visible={iteration6.started()} unmountWhenInvisible>
									<a.div
										className='unit'
										style={{
											opacity: iteration6.started()
												? iteration6.interpolations.opening.to(interpolations.easing("easeInOutCubic"))
												: 1,
										}}>
										<Observer>
											{() => (
												<SlideButton
													state={!iteration6.closeStarted() ? "active" : "inactive"}
													onSwipeEnded={iterationsControls.next}
												/>
											)}
										</Observer>
									</a.div>
								</VisibilitySwitch>
							</S.ButtonWrapper>
						)}
					</Observer>
				</S.Content>
			</Phone>
		</S.PhoneWrapper>
	);
};

function getCardProps(index: number, cardsAmount: number) {
	const center = Math.ceil(cardsAmount / 2) - 1;
	const offset = Math.abs(index - center);
	const sign = Math.sign(index - center);
	const normalizedIndex = offset / center;
	return { center, offset, sign, normalizedIndex, index };
}

function getCardStyle({
	type,
	cardProps,
	cardsAmount,
}: {
	type: "desktop" | "mobile";
	cardProps: ReturnType<typeof getCardProps>;
	cardsAmount: number;
}) {
	const { center, offset, normalizedIndex, sign, index } = cardProps;
	const shiftedIndex = sign < 0 ? index : index - 1;

	switch (type) {
		case "desktop":
			return {
				z: -5 * normalizedIndex - 0.01,
				zIndex: center - offset,
				rotateY: iteration3.interpolations.closing
					.to(interpolations.easing("easeInOutCubic"))
					.to(interpolations.invert)
					.to((value) => -0.25 * normalizedIndex * sign * value),
				opacity: iteration3.interpolations.opening.to(interpolations.easing("easeInOutCubic")),
				translateX:
					iteration3.currentState() === "opening"
						? iteration3.interpolations.opening
								.to(interpolations.easing("easeInOutCubic"))
								.to(interpolations.invert)
								.to((value) => `${200 * normalizedIndex * sign + 120 * normalizedIndex * sign * value}%`)
						: iteration3.interpolations.closing
								.to(interpolations.easing("easeInOutCubic"))
								.to(interpolations.invert)
								.to((value) => `${200 * normalizedIndex * sign * value}%`),
				scale: iteration3.interpolations.opening.to(interpolations.easing("easeInOutCubic")),
			};
		case "mobile":
			return {
				y:
					offset === 0
						? iteration3.currentState() === "opening"
							? `30%`
							: iteration3.interpolations.closing
									.to(interpolations.easing("easeInOutCubic"))
									.to(interpolations.invert)
									.to((value) => `${30 * value}%`)
						: iteration3.interpolations.opening
								.to(interpolations.range(0.5, 1))
								.to(interpolations.easing("easeInOutCubic"))
								.to((value) => `${-15 * (shiftedIndex + 1) * value + 30}%`),
				opacity:
					iteration3.currentState() === "opening"
						? offset === 0
							? iteration3.interpolations.opening
									.to(interpolations.range(0, 0.5))
									.to(interpolations.easing("easeInOutCubic"))
							: iteration3.interpolations.opening
									.to(interpolations.range(0.5, 1))
									.to(interpolations.easing("easeInOutCubic"))
						: offset === 0
						? 1
						: iteration3.interpolations.closing
								.to(interpolations.easing("easeInOutCubic"))
								.to(interpolations.invert),

				scale:
					offset === 0
						? iteration3.interpolations.opening
								.to(interpolations.range(0, 0.5))
								.to(interpolations.easing("easeInOutCubic"))
						: iteration3.interpolations.opening
								.to(interpolations.range(0.5, 1))
								.to(interpolations.easing("easeInOutCubic"))
								.to((value) => 1 - 0.15 * (shiftedIndex + 1) * value),
				zIndex: offset === 0 ? cardsAmount : cardsAmount - shiftedIndex,
			};
	}
}
