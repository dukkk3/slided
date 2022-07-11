import { useEffect, forwardRef, useContext } from "react";
import { Observer } from "mobx-react-lite";
import { a } from "react-spring";
import { when } from "mobx";

import { Iteration } from "@components/common/hoc/Iteration";

import { VisibilitySwitch } from "@components/common/ui/VisibilitySwitch";

import { Button } from "@components/common/ui/Button";
import { Image } from "@components/common/ui/Image";

import { useIterationsControls } from "@core/hooks/useIterationsControls";
import { useBreakpoint } from "@core/hooks/useBreakpoint";
import { useLocalStore } from "@core/hooks/useLocalStore";
import { useIteration } from "@core/hooks/useIteration";

import { interpolations } from "@core/helpers/iteration.helper";
import { mergeRefs } from "@core/utils/common.utils";

import { SlideButton } from "./SlideButton";

import { AnimatedSplitChars } from "../../helpers/AnimatedSplitChars";
import { Phone } from "../../shared/Phone";

import { context as promoContext } from "../../index";

import * as S from "./styled";

export interface Props {
	templatesSources: string[];
}

export const PhoneAssistant = forwardRef<HTMLDivElement, Props>(({ templatesSources }, ref) => {
	const iteration3 = useIteration(3);
	const breakpoint = useBreakpoint();
	const promoStore = useContext(promoContext);
	const iterationsControls = useIterationsControls();

	const localStore = useLocalStore({
		cardsWereShown: false,
	});

	useEffect(
		() =>
			when(
				() => iteration3.opened(),
				() => localStore.setCardsWereShown(true)
			),
		[iteration3, localStore]
	);

	return (
		<Iteration
			iterations={[3, 4, 5, 6, 7, 8]}
			checkForVisible={([iteration3, , , , , iteration8]) =>
				iteration3.started() && !iteration8.started()
			}
			visibilitySwitch={{ unmountWhenInvisible: false }}>
			{([iteration3, iteration4, iteration5, iteration6, iteration7]) => (
				<a.div
					data-iteration-name='PhoneAssistant'
					style={{
						opacity: iteration7.interpolations.opening
							.to(interpolations.step(0.45))
							.to(interpolations.easing("easeInOutCubic"))
							.to(interpolations.invert),
					}}>
					<Phone
						ref={ref}
						openingInterpolation={iteration3.interpolations.opening.to(
							interpolations.easing("easeInOutCubic")
						)}>
						<S.Content>
							<S.Face>
								<S.FaceWrapper
									ref={mergeRefs(
										promoStore.transforms.bigAssistantAndPhoneAssistant.endRef,
										promoStore.transforms.phoneAssistantAndShiftedAssistant.startRef
									)}
								/>
								<S.FaceWrapper
									ref={promoStore.transforms.phoneAssistantAndShiftedAssistant.endRef}
									style={{ transform: "translateX(-40%)" }}
								/>
								<S.FaceWrapper
									ref={promoStore.transforms.executorAndPhoneExecutor.endRef}
									style={{ transform: "translateX(40%)" }}
								/>
							</S.Face>
							<Observer>
								{() => (
									<S.DescriptionGroup>
										<VisibilitySwitch
											visible={iteration3.started() && !iteration4.ended()}
											unmountWhenInvisible={false}>
											<S.Description>
												<Observer>
													{() => (
														<AnimatedSplitChars
															text={["Choose a style", "from ready-made", "templates"]}
															openingInterpolation={iteration3.interpolations.opening.to(
																interpolations.easing("easeInOutCubic")
															)}
															closingInterpolation={iteration4.interpolations.closing.to(
																interpolations.easing("easeInOutCubic")
															)}
															type={iteration3.visible() || iteration4.visible("opening") ? "opening" : "closing"}
														/>
													)}
												</Observer>
											</S.Description>
										</VisibilitySwitch>
										<VisibilitySwitch visible={iteration5.visible()}>
											<S.Description $overlay>
												<Observer>
													{() => (
														<AnimatedSplitChars
															text={
																breakpoint.mobile()
																	? ["Our best designers", "are here to pick up", "the presentation... "]
																	: ["Our selected", "designers are on", "the mission to get", "your task done"]
															}
															openingInterpolation={iteration5.interpolations.opening
																.to(interpolations.defaultDuration(iteration5.durationFactorOpening))
																.to(interpolations.easing("easeInOutCubic"))}
															closingInterpolation={iteration5.interpolations.closing
																.to(interpolations.defaultDuration(iteration5.durationFactorClosing))
																.to(interpolations.easing("easeInOutCubic"))}
															type={iteration5.currentState()}
														/>
													)}
												</Observer>
											</S.Description>
										</VisibilitySwitch>
										<VisibilitySwitch visible={iteration6.started() && !iteration7.ended()}>
											<S.Description $overlay $big>
												<Observer>
													{() => (
														<AnimatedSplitChars
															text={
																breakpoint.mobile()
																	? ["Designer is set", "& ready to start"]
																	: ["Designer", "is ready", "to start"]
															}
															openingInterpolation={iteration6.interpolations.opening.to(
																interpolations.easing("easeInOutCubic")
															)}
															closingInterpolation={iteration6.interpolations.closing.to(() => 0)}
															type={iteration6.currentState()}
														/>
													)}
												</Observer>
											</S.Description>
										</VisibilitySwitch>
									</S.DescriptionGroup>
								)}
							</Observer>
							<Observer>
								{() => (
									<VisibilitySwitch
										visible={iteration3.started() && !iteration4.ended()}
										unmountWhenInvisible={false}>
										<div ref={promoStore.resizeObservers.phoneCardsContainer.ref}>
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
																		className={
																			localStore.cardsWereShown ? "safari-border-radius-overflow-bugfix" : ""
																		}
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
										</div>
									</VisibilitySwitch>
								)}
							</Observer>
							<Observer>
								{() => (
									<S.ButtonWrapper>
										<VisibilitySwitch visible={iteration3.closeStarted() && !iteration4.ended()}>
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
												<Button
													onClick={() => {
														iterationsControls.next();
														iterationsControls.next();
													}}>
													Choose
												</Button>
											</a.div>
										</VisibilitySwitch>
										<VisibilitySwitch visible={iteration4.closeStarted() && !iteration5.ended()}>
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
																<Button theme='grey'>Searching the best...</Button>
															</a.div>
														</div>
													) : null
												}
											</Observer>
										</VisibilitySwitch>
										<VisibilitySwitch visible={iteration6.started()}>
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
				</a.div>
			)}
		</Iteration>
	);
});

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
	iteration3,
	cardsAmount,
}: {
	type: "desktop" | "mobile";
	cardProps: ReturnType<typeof getCardProps>;
	iteration3: ReturnType<typeof useIteration>;
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
