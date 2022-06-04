import { useCallback, useEffect } from "react";
import { Observer } from "mobx-react-lite";
import { a, config, easings, useSpring } from "react-spring";

import { PromoContainer } from "@components/containers/layout/PromoContainer";
import { TemplatesCards } from "@components/containers/animated/TemplatesCards";
import { AssistantFace } from "@components/containers/animated/AssistantFace";
import { AnimatedSplitChars } from "@components/containers/animated/AnimatedSplitChars";
import { Promo } from "@components/containers/animated/Promo";
import { Phone } from "@components/containers/animated/Phone";
import { Executors } from "@components/containers/animated/Executors";
import { CarTemplate } from "@components/containers/animated/CarTemplate";
import { ReadyTemplatesCards } from "@components/containers/animated/ReadyTemplatesCards";
import { TableBackground } from "@components/containers/animated/TableBackground";

import { VisibilitySwitch } from "@components/common/hoc/VisibilitySwitch";

import { UserCursor } from "@components/common/ordinary/UserCursor";

import { DebugIterationControls } from "@components/common/simple/DebugIterationControls";

import { Image } from "@components/common/ui/Image";
import { Button } from "@components/common/ui/Button";

import { useTransformDifference, useIterationControls, useIteration } from "@core/hooks";
import { mergeRefs } from "@core/utils";

import { getRasterImageByName } from "@assets/images";

import * as S from "./styled";

export const Sandbox: React.FC = () => {
	const iterationControls = useIterationControls();
	const { scaleProgress: locatorPulse } = useSpring({
		from: { scaleProgress: 0.3 },
		to: { scaleProgress: 1 },
		config: { duration: 1500, easing: easings.linear },
		loop: true,
	});
	const { scaleProgress: assistantFacePulse } = useSpring({
		from: { scaleProgress: 0 },
		to: { scaleProgress: 1 },
		loop: { reverse: true },
		config: config.gentle,
	});

	const transformDifferenceBtwFaceAndPhoneFace = useTransformDifference();
	const transformDifferenceBtwPhoneFaceAndShiftedPhoneFace = useTransformDifference();
	const transformDifferenceBtwExecutorFaceAndExecutorPhoneFace = useTransformDifference();
	const transformDifferenceBtwBigTemplateAndSmallTemplate = useTransformDifference();
	const transformDifferenceBtwSmallTemplateAndPhoneTemplate = useTransformDifference({
		debug: true,
		calculationPreset: "rect",
	});

	const iteration0 = useIteration(0);
	const iteration1 = useIteration(1);
	const iteration2 = useIteration(2);
	const iteration3 = useIteration(3);
	const iteration4 = useIteration(4);
	const iteration5 = useIteration(5);
	const iteration6 = useIteration(6);
	const iteration7 = useIteration(7);
	const iteration8 = useIteration(8);
	const iteration9 = useIteration(9);

	const getFaceStyle = useCallback(
		(stage: "to-min" | "to-min-shifted") => {
			let scaleX = 1;
			let scaleY = 1;
			let x = 0;
			let y = 0;

			switch (stage) {
				case "to-min":
					x = transformDifferenceBtwFaceAndPhoneFace.getDifference().position.x;
					y = transformDifferenceBtwFaceAndPhoneFace.getDifference().position.y;
					scaleX = 1 - transformDifferenceBtwFaceAndPhoneFace.getDifference().scale.x;
					scaleY = 1 - transformDifferenceBtwFaceAndPhoneFace.getDifference().scale.y;
					break;
				case "to-min-shifted":
					x = transformDifferenceBtwPhoneFaceAndShiftedPhoneFace.getDifference().position.x;
					y = transformDifferenceBtwPhoneFaceAndShiftedPhoneFace.getDifference().position.y;
					scaleX = 1 - transformDifferenceBtwPhoneFaceAndShiftedPhoneFace.getDifference().scale.x;
					scaleY = 1 - transformDifferenceBtwPhoneFaceAndShiftedPhoneFace.getDifference().scale.y;
					break;
			}

			return { x, y, scaleX, scaleY };
		},
		[transformDifferenceBtwFaceAndPhoneFace, transformDifferenceBtwPhoneFaceAndShiftedPhoneFace]
	);

	return (
		<S.Sandbox style={{ y: iterationControls.animated.scrollTop.to((value) => -value) }}>
			<DebugIterationControls />
			<TableBackground />
			<S.LayerWrapper>
				<Observer>
					{() => (
						<>
							<VisibilitySwitch visible={iteration6.visible("closing")}>
								<S.PulseCircle
									style={{
										scale: iteration6.interpolations.closing,
										opacity: iteration6.interpolations.closing.to((value) => 0.8 * (1 - value)),
									}}
								/>
							</VisibilitySwitch>
							<VisibilitySwitch visible={iteration5.visible()}>
								<S.PulseCircle
									$theme='white'
									style={{
										scale: locatorPulse,
										opacity: locatorPulse.to((value) => 1 - value),
									}}
								/>
							</VisibilitySwitch>
						</>
					)}
				</Observer>
				<PromoContainer>
					<Observer>
						{() => (
							<VisibilitySwitch visible={iteration0.visible()}>
								<S.PromoWrapper>
									<Promo closingInterpolation={iteration0.interpolations.closing} />
								</S.PromoWrapper>
							</VisibilitySwitch>
						)}
					</Observer>
					<Observer>
						{() => (
							<VisibilitySwitch visible={iteration8.started()}>
								<S.PhoneWrapper $alternative>
									<Phone
										openingInterpolation={iteration7.interpolations.closing.to((value) =>
											iterationControls.toRange(value, 0.99, 1)
										)}
										backgroundZoomInterpolation={iteration7.interpolations.closing.to((value) =>
											iterationControls.toRange(value, 0.99, 1)
										)}
										hiddenContent>
										<S.PhoneDescriptionWrapper>
											<Observer>
												{() => (
													<VisibilitySwitch visible={iteration8.visible()}>
														<S.PhoneDescription>
															<AnimatedSplitChars
																content={["You can", "track progress", "in real time on your phone"]}
																openingInterpolation={iteration8.interpolations.opening}
																closingInterpolation={iteration8.interpolations.closing}
																type={iteration8.visible("opening") ? "opening" : "closing"}
															/>
														</S.PhoneDescription>
													</VisibilitySwitch>
												)}
											</Observer>
											<Observer>
												{() => (
													<VisibilitySwitch visible={iteration9.visible()}>
														<S.PhoneDescription $overlay>
															<AnimatedSplitChars
																content={["Your", "presentation", "is done!"]}
																openingInterpolation={iteration9.interpolations.opening}
																closingInterpolation={iteration9.interpolations.closing}
																type={iteration9.visible("opening") ? "opening" : "closing"}
															/>
														</S.PhoneDescription>
													</VisibilitySwitch>
												)}
											</Observer>
										</S.PhoneDescriptionWrapper>
										<S.PhoneReadyTemplatesCardsWrapper>
											<ReadyTemplatesCards
												hiddenTemplateRef={transformDifferenceBtwSmallTemplateAndPhoneTemplate.endRef}
												hideScanLineInterpolation={iteration8.interpolations.closing
													.to((value) => iterationControls.toRange(value, 0.95, 1))
													.to((value) => 1 - value)}
												showHiddenLayerInterpolation={iteration8.interpolations.closing}
												shakeCardsInterpolation={iteration9.interpolations.opening}
												templates={[
													{ source: getRasterImageByName("CarTemplateSource") },
													{
														source: getRasterImageByName("BlueTemplateSource"),
														visibleLayerSource: getRasterImageByName("BrightTemplateSource"),
													},
													{ source: getRasterImageByName("BrightTemplateSource") },
													{ source: getRasterImageByName("BrightTemplateSource") },
													{ source: getRasterImageByName("BrightTemplateSource") },
												]}
											/>
										</S.PhoneReadyTemplatesCardsWrapper>
									</Phone>
								</S.PhoneWrapper>
							</VisibilitySwitch>
						)}
					</Observer>
					<Observer>
						{() => (
							<VisibilitySwitch visible={iteration3.started() && !iteration8.started()}>
								<S.PhoneWrapper>
									<Phone
										openingInterpolation={iteration3.interpolations.opening}
										backgroundZoomInterpolation={iteration4.interpolations.opening}>
										<S.PhoneFace>
											<S.PhoneFaceWrapper
												ref={mergeRefs(
													transformDifferenceBtwFaceAndPhoneFace.endRef,
													transformDifferenceBtwPhoneFaceAndShiftedPhoneFace.startRef
												)}
											/>
											<S.PhoneFaceWrapper
												ref={transformDifferenceBtwPhoneFaceAndShiftedPhoneFace.endRef}
												style={{ transform: "translateX(-40%)" }}
											/>
											<S.PhoneFaceWrapper
												ref={transformDifferenceBtwExecutorFaceAndExecutorPhoneFace.endRef}
												style={{ transform: "translateX(40%)" }}
											/>
										</S.PhoneFace>
										<S.PhoneDescriptionWrapper>
											<Observer>
												{() => (
													<VisibilitySwitch visible={iteration3.started() && !iteration4.ended()}>
														<S.PhoneDescription>
															<AnimatedSplitChars
																content={["Choose a style", "from ready-made", "templates"]}
																openingInterpolation={iteration3.interpolations.opening}
																closingInterpolation={iteration4.interpolations.closing}
																type={iteration3.visible() || iteration4.visible("opening") ? "opening" : "closing"}
															/>
														</S.PhoneDescription>
													</VisibilitySwitch>
												)}
											</Observer>
											<Observer>
												{() => (
													<VisibilitySwitch visible={iteration5.visible()}>
														<S.PhoneDescription $overlay>
															<AnimatedSplitChars
																content={[
																	"Our selected",
																	"designers are on",
																	"the mission to get",
																	"your task done",
																]}
																openingInterpolation={iteration5.interpolations.opening}
																closingInterpolation={iteration5.interpolations.closing}
																type={iteration5.visible("opening") ? "opening" : "closing"}
															/>
														</S.PhoneDescription>
													</VisibilitySwitch>
												)}
											</Observer>
											<Observer>
												{() => (
													<VisibilitySwitch visible={iteration6.started()}>
														<S.PhoneDescription $overlay $big>
															<AnimatedSplitChars
																content={["Slide it to", "make it"]}
																openingInterpolation={iteration6.interpolations.opening}
																closingInterpolation={iteration6.interpolations.closing.to((value) => 0)}
																type={iteration6.visible("opening") ? "opening" : "closing"}
															/>
														</S.PhoneDescription>
													</VisibilitySwitch>
												)}
											</Observer>
										</S.PhoneDescriptionWrapper>
										<Observer>
											{() => (
												<VisibilitySwitch visible={iteration3.started() && !iteration4.ended()}>
													<S.PhoneCards
														style={{
															opacity: iteration4.interpolations.closing.to((value) => 1 - value),
															y: iteration4.interpolations.closing.to((value) => `${2 * value}rem`),
														}}>
														<TemplatesCards
															openingInterpolation={iteration3.interpolations.opening}
															closingInterpolation={iteration3.interpolations.closing}
															cardZoomInterpolation={iteration4.interpolations.opening}
															type={iteration3.visible("opening") ? "opening" : "closing"}
														/>
													</S.PhoneCards>
												</VisibilitySwitch>
											)}
										</Observer>
										<S.PhoneButtonWrapper>
											<Observer>
												{() => (
													<>
														<VisibilitySwitch visible={iteration3.startClosed() && !iteration4.ended()}>
															<a.div
																style={{
																	opacity: iteration3.visible()
																		? iteration3.interpolations.closing
																		: iteration4.interpolations.closing
																				.to((value) => iterationControls.toRange(value, 0, 0.5))
																				.to((value) => 1 - value),
																}}>
																<Button>Choose</Button>
															</a.div>
														</VisibilitySwitch>
														<VisibilitySwitch visible={iteration4.startClosed() && !iteration5.ended()}>
															<a.div
																style={{
																	opacity: iteration4.visible("closing")
																		? iteration4.interpolations.closing.to((value) =>
																				iterationControls.toRange(value, 0, 0.5)
																		  )
																		: iteration5.interpolations.closing.to((value) => 1 - value),
																}}>
																<Button theme='grey'>Searching the best...</Button>
															</a.div>
														</VisibilitySwitch>
														<VisibilitySwitch visible={iteration6.started()}>
															<a.div
																style={{
																	opacity: iteration6.started() ? iteration6.interpolations.opening : 1,
																}}>
																<S.PhoneSlide>
																	<S.PhoneSlideContent
																		style={{ x: iteration6.interpolations.closing.to((value) => `${value * 100}%`) }}
																	/>
																</S.PhoneSlide>
															</a.div>
														</VisibilitySwitch>
													</>
												)}
											</Observer>
										</S.PhoneButtonWrapper>
									</Phone>
								</S.PhoneWrapper>
							</VisibilitySwitch>
						)}
					</Observer>
					<S.StartCarTemplatePosition ref={transformDifferenceBtwBigTemplateAndSmallTemplate.startRef} />
					<VisibilitySwitch visible={false}>
						<S.CarTemplateWrapper
							ref={mergeRefs(
								transformDifferenceBtwBigTemplateAndSmallTemplate.endRef,
								transformDifferenceBtwSmallTemplateAndPhoneTemplate.startRef
							)}
						/>
					</VisibilitySwitch>
					<Observer>
						{() => (
							<VisibilitySwitch visible={iteration7.started() && !iteration8.opened()}>
								<S.CarTemplateWrapper
									style={
										iteration7.visible()
											? {
													x: iteration7.interpolations.opening.to(
														(value) =>
															transformDifferenceBtwBigTemplateAndSmallTemplate.getDifference().position.x *
															(1 - value)
													),
													y: iteration7.interpolations.opening.to(
														(value) =>
															transformDifferenceBtwBigTemplateAndSmallTemplate.getDifference().position.y *
															(1 - value)
													),
													scaleX: iteration7.interpolations.opening.to(
														(value) =>
															1 +
															(1 - transformDifferenceBtwBigTemplateAndSmallTemplate.getDifference().scale.x) *
																(1 - value)
													),
													scaleY: iteration7.interpolations.opening.to(
														(value) =>
															1 +
															(1 - transformDifferenceBtwBigTemplateAndSmallTemplate.getDifference().scale.y) *
																(1 - value)
													),
													opacity: iteration7.interpolations.opening.to((value) =>
														iterationControls.toRange(value, 0, 0.5)
													),
											  }
											: iteration8.started()
											? {
													x: iteration8.interpolations.opening
														.to((value) => iterationControls.toRange(value, 0, 0.5))
														.to(
															(value) =>
																transformDifferenceBtwSmallTemplateAndPhoneTemplate.getDifference().position.x *
																value
														),
													y: iteration8.interpolations.opening
														.to((value) => iterationControls.toRange(value, 0, 0.5))
														.to(
															(value) =>
																transformDifferenceBtwSmallTemplateAndPhoneTemplate.getDifference().position.y *
																value
														),
													["--scale-x" as any]: iteration8.interpolations.opening
														.to((value) => iterationControls.toRange(value, 0, 0.5))
														.to(
															(value) =>
																1 -
																(1 - transformDifferenceBtwSmallTemplateAndPhoneTemplate.getDifference().scale.x) *
																	value
														),
													["--scale-y" as any]: iteration8.interpolations.opening
														.to((value) => iterationControls.toRange(value, 0, 0.5))
														.to(
															(value) =>
																1 -
																(1 - transformDifferenceBtwSmallTemplateAndPhoneTemplate.getDifference().scale.y) *
																	value
														),
											  }
											: {}
									}>
									<CarTemplate
										type={iteration8.started() ? "fix" : "opening"}
										templateSource={getRasterImageByName("CarTemplateSource")}
										fixScaleInterpolation={iteration8.interpolations.opening.to((value) => 0)}
										openingInterpolation={iteration7.interpolations.opening}
									/>
									<Observer>
										{() => (
											<S.UserCursorWrapper
												style={{
													x: iteration7.interpolations.closing
														.to({
															range: [0, 1],
															output: [0.85, 0.45],
															easing: easings.easeOutQuad,
														})
														.to((value) => `${value * 100}%`),
													y: iteration7.interpolations.closing
														.to({
															range: [0, 1],
															output: [0.75, 0.1],
															easing: easings.easeOutQuad,
														})
														.to((value) => `${value * 100}%`),
													opacity: iteration7.visible()
														? iteration7.interpolations.closing.to((value) =>
																iterationControls.toRange(value, 0, 0.1)
														  )
														: iteration8.interpolations.opening.to(
																(value) => 1 - iterationControls.toRange(value, 0, 0.1)
														  ),
												}}>
												<UserCursor avatarSource={getRasterImageByName("BlackTemplateSource")} />
											</S.UserCursorWrapper>
										)}
									</Observer>
								</S.CarTemplateWrapper>
							</VisibilitySwitch>
						)}
					</Observer>
					<Observer>
						{() => (
							<VisibilitySwitch visible={iteration5.started() && !iteration8.started()}>
								<S.ExecutorsWrapper>
									<Executors
										type={iteration5.visible("opening") ? "opening" : "closing"}
										openingInterpolation={iteration5.interpolations.opening}
										closingInterpolation={iteration5.interpolations.closing}
										executorFaceRef={transformDifferenceBtwExecutorFaceAndExecutorPhoneFace.startRef}
										renderExecutorFace={({ Component, data }) => (
											<Observer>
												{() => (
													<Component
														style={{
															x: iteration5.interpolations.closing.to(
																(value) =>
																	value *
																	transformDifferenceBtwExecutorFaceAndExecutorPhoneFace.getDifference().position.x
															),
															y: iteration5.interpolations.closing.to(
																(value) =>
																	value *
																	transformDifferenceBtwExecutorFaceAndExecutorPhoneFace.getDifference().position.y
															),
															scaleX: iteration5.interpolations.closing.to(
																(value) =>
																	1 +
																	(transformDifferenceBtwExecutorFaceAndExecutorPhoneFace.getDifference().scale.x -
																		1) *
																		value
															),
															scaleY: iteration5.interpolations.closing.to(
																(value) =>
																	1 +
																	(transformDifferenceBtwExecutorFaceAndExecutorPhoneFace.getDifference().scale.y -
																		1) *
																		value
															),
														}}>
														<Image src={data.avatarSource} />
													</Component>
												)}
											</Observer>
										)}
									/>
								</S.ExecutorsWrapper>
							</VisibilitySwitch>
						)}
					</Observer>
					<Observer>
						{() => (
							<VisibilitySwitch visible={iteration1.started() && !iteration7.startClosed()}>
								<S.AssistantLayout>
									<S.AssistantFaceWrapper ref={transformDifferenceBtwFaceAndPhoneFace.startRef}>
										<Observer>
											{() => (
												<S.AssistantFaceAnimatedWrapper
													style={
														iteration3.visible() || iteration4.visible()
															? {
																	x: iteration3.interpolations.opening.to(
																		(value) => getFaceStyle("to-min").x * value
																	),
																	y: iteration3.interpolations.opening.to(
																		(value) => getFaceStyle("to-min").y * value
																	),
																	scaleX: iteration3.interpolations.opening.to(
																		(value) => 1 - getFaceStyle("to-min").scaleX * value
																	),
																	scaleY: iteration3.interpolations.opening.to(
																		(value) => 1 - getFaceStyle("to-min").scaleY * value
																	),
															  }
															: iteration5.started()
															? {
																	x: iteration5.interpolations.closing.to(
																		(value) => getFaceStyle("to-min").x + getFaceStyle("to-min-shifted").x * value
																	),
																	y: iteration5.interpolations.closing.to(
																		(value) => getFaceStyle("to-min").y + getFaceStyle("to-min-shifted").y * value
																	),
																	scaleX: 1 - getFaceStyle("to-min").scaleX,
																	scaleY: 1 - getFaceStyle("to-min").scaleY,
															  }
															: {}
													}>
													<AssistantFace
														openingInterpolation={iteration1.interpolations.opening}
														pulseInterpolation={
															iteration1.opened()
																? assistantFacePulse.to({
																		range: [0, 0.25, 0.5, 0.75, 1],
																		output: [1, 1.1, 1.05, 1.1, 1],
																  })
																: iteration1.interpolations.opening
														}
													/>
												</S.AssistantFaceAnimatedWrapper>
											)}
										</Observer>
									</S.AssistantFaceWrapper>
									<Observer>
										{() => (
											<VisibilitySwitch
												visible={iteration0.visible("closing") || iteration1.visible() || iteration2.visible()}>
												<S.AssistantDescriptionWrapper>
													<Observer>
														{() => (
															<VisibilitySwitch visible={iteration1.visible()}>
																<div>
																	<AnimatedSplitChars
																		content={["Let’s see how it works.", "Upload your content."]}
																		openingInterpolation={iteration1.interpolations.opening}
																		closingInterpolation={iteration1.interpolations.closing}
																		type={iteration1.visible("opening") ? "opening" : "closing"}
																	/>
																</div>
															</VisibilitySwitch>
														)}
													</Observer>
													<Observer>
														{() => (
															<VisibilitySwitch visible={iteration2.visible()}>
																<div style={{ top: 0, left: 0, width: "100%", position: "absolute" }}>
																	<AnimatedSplitChars
																		content={["I’m here to organize it all", "into a neat structure"]}
																		openingInterpolation={iteration2.interpolations.opening}
																		closingInterpolation={iteration2.interpolations.closing}
																		type={iteration2.visible("opening") ? "opening" : "closing"}
																	/>
																</div>
															</VisibilitySwitch>
														)}
													</Observer>
												</S.AssistantDescriptionWrapper>
											</VisibilitySwitch>
										)}
									</Observer>
								</S.AssistantLayout>
							</VisibilitySwitch>
						)}
					</Observer>
				</PromoContainer>
			</S.LayerWrapper>
		</S.Sandbox>
	);
};
