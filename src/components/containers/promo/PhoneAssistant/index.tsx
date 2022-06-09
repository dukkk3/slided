import { memo } from "react";
import { a } from "react-spring";
import { Observer } from "mobx-react-lite";

import { PhoneCard } from "@components/common/ordinary/PhoneCard";
import { AnimatedSplitChars } from "@components/common/ordinary/AnimatedSplitChars";

import { Iteration } from "@components/common/hoc/Iteration";
import { VisibilitySwitch } from "@components/common/hoc/VisibilitySwitch";

import { Button } from "@components/common/ui/Button";
import { Image } from "@components/common/ui/Image";

import { useIterationsContext } from "@core/hooks";
import { inlineSwitch, toRange } from "@core/utils";

import * as S from "./styled";

export interface Props {
	templates: string[];
	executorContainerRef?: React.ForwardedRef<any>;
	assistantContainerRef?: React.ForwardedRef<any>;
	shiftedAssistantContainerRef?: React.ForwardedRef<any>;
}

export const PhoneAssistant: React.FC<Props> = memo(
	({ templates, assistantContainerRef, shiftedAssistantContainerRef, executorContainerRef }) => {
		const iterationsContext = useIterationsContext();

		return (
			<Iteration
				iteration={[3, 4, 8]}
				visibleCondition={(iteration3, _, iteration8) => iteration3.started() && !iteration8.started()}>
				{(iteration3, iteration4) => (
					<PhoneCard
						openingInterpolation={iteration3.interpolations.toEasing("easeInOutCubic").opening}
						backgroundZoomInterpolation={iteration4.interpolations.toEasing("easeInOutCubic").opening}>
						<S.Face>
							<S.FaceWrapper ref={assistantContainerRef} />
							<S.FaceWrapper
								ref={shiftedAssistantContainerRef}
								style={{ transform: "translateX(-40%)" }}
							/>
							<S.FaceWrapper ref={executorContainerRef} style={{ transform: "translateX(40%)" }} />
						</S.Face>
						<S.DescriptionWrapper>
							<Observer>
								{() => (
									<VisibilitySwitch visible={iteration3.started() && !iteration4.ended()}>
										<S.Description>
											<AnimatedSplitChars
												content={["Choose a style", "from ready-made", "templates"]}
												openingInterpolation={iteration3.interpolations.toEasing("easeInOutCubic").opening}
												closingInterpolation={iteration4.interpolations.toEasing("easeInOutCubic").closing}
												type={iteration3.visible() || iteration4.visible("opening") ? "opening" : "closing"}
											/>
										</S.Description>
									</VisibilitySwitch>
								)}
							</Observer>
							<Iteration iteration={5} normalizeDuration>
								{(iteration5) => {
									console.log(iteration5);
									return (
										<S.Description $overlay>
											<Observer>
												{() => (
													<AnimatedSplitChars
														content={["Our selected", "designers are on", "the mission to get", "your task done"]}
														openingInterpolation={iteration5.interpolations.toEasing("easeInOutCubic").opening}
														closingInterpolation={iteration5.interpolations.toEasing("easeInOutCubic").closing}
														type={iteration5.currentType()}
													/>
												)}
											</Observer>
										</S.Description>
									);
								}}
							</Iteration>
							<Iteration
								iteration={[6, 7]}
								visibleCondition={(iteration6, iteration7) => iteration6.started() && !iteration7.ended()}>
								{(iteration6) => (
									<S.Description $overlay $big>
										<Observer>
											{() => (
												<AnimatedSplitChars
													content={["Slide it to", "make it"]}
													openingInterpolation={iteration6.interpolations.toEasing("easeInOutCubic").opening}
													closingInterpolation={iteration6.interpolations
														.toEasing("easeInOutCubic")
														.closing.to(() => 0)}
													type={iteration6.currentType()}
												/>
											)}
										</Observer>
									</S.Description>
								)}
							</Iteration>
						</S.DescriptionWrapper>
						<Iteration
							iteration={[3, 4]}
							visibleCondition={(iteration3, iteration4) => iteration3.started() && !iteration4.ended()}>
							{(iteration3, iteration4) => (
								<S.Cards
									style={{
										opacity: iteration4.interpolations
											.toEasing("easeInOutCubic")
											.closing.to((value) => 1 - value),
										y: iteration4.interpolations
											.toEasing("easeInOutCubic")
											.closing.to((value) => `${2 * value}rem`),
									}}>
									<Observer>
										{() => (
											<S.TemplatesCards>
												{templates
													.map((templateSource, index) => ({
														templateSource,
														...getCardProps(index, templates.length),
													}))
													.map(({ templateSource, center, offset, sign, normalizedIndex }, index) => (
														<S.Card
															key={index}
															className='safari-border-radius-overflow-bugfix'
															data-type={iteration3.currentType()}
															style={{
																translateZ: -5 * normalizedIndex,
																zIndex: center - offset,
																rotateY: iteration3.interpolations
																	.toEasing("easeInOutCubic")
																	.closing.to((value) => -0.25 * normalizedIndex * sign * (1 - value)),
																opacity: iteration3.interpolations.toEasing("easeInOutCubic").opening,
																translateX: inlineSwitch(
																	iteration3.currentType() === "opening",
																	iteration3.interpolations
																		.toEasing("easeInOutCubic")
																		.opening.to(
																			(value) =>
																				`${200 * normalizedIndex * sign + 120 * normalizedIndex * sign * (1 - value)}%`
																		),
																	iteration3.interpolations
																		.toEasing("easeInOutCubic")
																		.closing.to((value) => `${200 * normalizedIndex * sign * (1 - value)}%`)
																),
																scale: iteration3.interpolations.toEasing("easeInOutCubic").opening,
															}}>
															<S.CardImageWrapper
																style={{
																	scale: inlineSwitch(
																		index === center,
																		iteration4.interpolations
																			.toEasing("easeInOutCubic")
																			.opening.to((value) => 1 + 0.4 * (1 - value)),
																		1
																	),
																}}>
																<Image src={templateSource} lazy={false} />
															</S.CardImageWrapper>
														</S.Card>
													))}
											</S.TemplatesCards>
										)}
									</Observer>
								</S.Cards>
							)}
						</Iteration>
						<S.ButtonWrapper>
							<Iteration
								iteration={[3, 4]}
								visibleCondition={(iteration3, iteration4) =>
									iteration3.startClosed() && !iteration4.ended()
								}>
								{(iteration3, iteration4) => (
									<a.div
										className='unit'
										style={{
											opacity: inlineSwitch(
												iteration3.visible(),
												iteration3.interpolations.toEasing("easeInOutCubic").closing,
												iteration4.interpolations
													.toEasing("easeInOutCubic")
													.closing.to((value) => toRange(value, 0, 0.5))
													.to((value) => 1 - value)
											),
										}}>
										<Button onClick={iterationsContext.next}>Choose</Button>
									</a.div>
								)}
							</Iteration>
							<Iteration
								iteration={[4, 5]}
								visibleCondition={(iteration4, iteration5) =>
									iteration4.startClosed() && !iteration5.ended()
								}
								style={{ pointerEvents: "none" }}>
								{(iteration4, iteration5) => (
									<a.div
										className='unit'
										style={{
											opacity: inlineSwitch(
												iteration4.visible("closing"),
												iteration4.interpolations
													.toEasing("easeInOutCubic")
													.closing.to((value) => toRange(value, 0, 0.5)),
												iteration5.interpolations.toEasing("easeInOutCubic").closing.to((value) => 1 - value)
											),
										}}>
										<Button theme='grey' style={{ cursor: "default" }}>
											Searching the best...
										</Button>
									</a.div>
								)}
							</Iteration>
							<Iteration iteration={6} visibleCondition={(iteration6) => iteration6.started()}>
								{(iteration6) => (
									<a.div
										className='unit'
										style={{
											opacity: inlineSwitch(
												iteration6.started(),
												iteration6.interpolations.toEasing("easeInOutCubic").opening,
												1
											),
										}}>
										<S.Slide onClick={iterationsContext.next}>
											<S.SlideContent
												style={{
													x: iteration6.interpolations
														.toEasing("easeInOutCubic")
														.closing.to((value) => `${value * 100}%`),
												}}
											/>
										</S.Slide>
									</a.div>
								)}
							</Iteration>
						</S.ButtonWrapper>
					</PhoneCard>
				)}
			</Iteration>
		);
	}
);

function getCardProps(index: number, cardsAmount: number) {
	const center = Math.ceil(cardsAmount / 2) - 1;
	const offset = Math.abs(index - center);
	const sign = Math.sign(index - center);
	const normalizedIndex = offset / center;
	return { center, offset, sign, normalizedIndex };
}
