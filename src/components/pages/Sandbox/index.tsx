import { reaction } from "mobx";
import { useCallback, useEffect, useRef } from "react";
import { Observer } from "mobx-react-lite";
import { config, easings, useSpring } from "react-spring";

import { Promo } from "@components/containers/animated/Promo";
import { Assistant } from "@components/containers/animated/Assistant";
import { Executors } from "@components/containers/animated/Executors";
import { PhoneAssistant } from "@components/containers/animated/PhoneAssistant";
import { PhoneTemplates } from "@components/containers/animated/PhoneTemplates";
import { TableBackground } from "@components/containers/animated/TableBackground";
import { TemplatesGrid } from "@components/containers/animated/TemplatesGrid";
import { Tariff } from "@components/containers/animated/Tariff";

import { AssistantFace } from "@components/promo/AssistantFace";
import { CarTemplate } from "@components/promo/CarTemplate";
import { UserCursor } from "@components/promo/UserCursor";

import { VisibilitySwitch } from "@components/common/hoc/VisibilitySwitch";

import { DebugIterationControls } from "@components/common/simple/DebugIterationControls";

import { Image } from "@components/common/ui/Image";
import { PromoContainer } from "@components/common/ui/PromoContainer";

import { useIteration, useIterationControls, useTransformDifference } from "@core/hooks";
import { mergeRefs, step } from "@core/utils";

import { getRasterImageByName } from "@assets/images";

import * as S from "./styled";
import { AnimatedSplitChars } from "@components/promo/AnimatedSplitChars";
import { Footer } from "@components/containers/layout/Footer";

export const Sandbox: React.FC = () => {
	const iterationControls = useIterationControls();
	const { scaleProgress: assistantFacePulse } = useSpring({
		from: { scaleProgress: 0 },
		to: { scaleProgress: 1 },
		loop: { reverse: true },
		config: config.gentle,
	});

	const sandboxRef = useRef<HTMLDivElement>(null);

	const transformDifferenceBtwFaceAndPhoneFace = useTransformDifference();
	const transformDifferenceBtwPhoneFaceAndShiftedPhoneFace = useTransformDifference();
	const transformDifferenceBtwExecutorFaceAndExecutorPhoneFace = useTransformDifference();
	const transformDifferenceBtwBigTemplateAndSmallTemplate = useTransformDifference();
	const transformDifferenceBtwSmallTemplateAndGridTemplate = useTransformDifference({
		calculationPreset: "rect",
	});
	const transformDifferenceBtwSmallTemplateAndPhoneTemplate = useTransformDifference({
		calculationPreset: "rect",
	});

	const iteration0 = useIteration(0);
	const iteration1 = useIteration(1);
	const iteration3 = useIteration(3);
	const iteration4 = useIteration(4);
	const iteration5 = useIteration(5);
	const iteration7 = useIteration(7);
	const iteration8 = useIteration(8);
	const iteration9 = useIteration(9);
	const iteration10 = useIteration(10);
	const iteration11 = useIteration(11);
	const lastIteration = useIteration(iterationControls.iterations);

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

	useEffect(
		() =>
			reaction(
				() => transformDifferenceBtwSmallTemplateAndPhoneTemplate.startResizeObserver.getSize(),
				(size) => {
					const sandbox = sandboxRef.current;
					if (!sandbox) return;
					sandbox.style.setProperty("--template-card-ratio", `${size.width / size.height}`);
				}
			),
		[transformDifferenceBtwSmallTemplateAndPhoneTemplate]
	);

	useEffect(
		() =>
			reaction(
				() => transformDifferenceBtwSmallTemplateAndGridTemplate.startResizeObserver.getSize(),
				(size) => {
					const sandbox = sandboxRef.current;
					if (!sandbox) return;
					sandbox.style.setProperty("--template-card-width", `${size.width}px`);
					sandbox.style.setProperty("--template-card-height", `${size.height}px`);
				}
			),
		[transformDifferenceBtwSmallTemplateAndGridTemplate]
	);

	useEffect(
		() =>
			reaction(
				() => iteration8.started(),
				(started) => {
					if (!started) return;
					transformDifferenceBtwSmallTemplateAndPhoneTemplate.calculate();
				}
			),
		[iteration8, transformDifferenceBtwSmallTemplateAndPhoneTemplate]
	);

	return (
		<>
			<S.Sandbox
				ref={sandboxRef}
				style={
					{
						// y: iterationControls.animated.scrollTop.to((value) => -value),
					}
				}>
				<DebugIterationControls />
				<TableBackground />
				<S.LayerWrapper>
					<Observer>
						{() => (
							<VisibilitySwitch visible={iteration11.started()}>
								<S.TariffWrapper>
									<Tariff />
								</S.TariffWrapper>
							</VisibilitySwitch>
						)}
					</Observer>
					<Observer>
						{() => (
							<VisibilitySwitch visible={iteration9.startClosed() || iteration10.visible()}>
								<div>
									<VisibilitySwitch visible={false}>
										<S.TemplatesGridWrapper>
											<TemplatesGrid
												centerTemplateRef={transformDifferenceBtwSmallTemplateAndGridTemplate.endRef}
											/>
										</S.TemplatesGridWrapper>
									</VisibilitySwitch>
									<S.TemplatesGridWrapper
										style={{
											y: iteration10.interpolations.closing.to((value) => `${-50 * value}%`),
											opacity: iteration10.interpolations.closing.to((value) => 1 - value),
										}}>
										<TemplatesGrid />
										<Observer>
											{() => (
												<VisibilitySwitch visible={iteration10.visible()}>
													<S.TemplatesGridTitle>
														<Observer>
															{() => (
																<AnimatedSplitChars
																	type={iteration10.visible("opening") ? "opening" : "closing"}
																	content={["We have thousands", "of slides behind"]}
																	openingInterpolation={iteration10.interpolations.opening}
																	closingInterpolation={iteration10.interpolations.closing}
																/>
															)}
														</Observer>
													</S.TemplatesGridTitle>
												</VisibilitySwitch>
											)}
										</Observer>
									</S.TemplatesGridWrapper>
								</div>
							</VisibilitySwitch>
						)}
					</Observer>
					<Observer>
						{() => (
							<VisibilitySwitch visible={iteration9.visible("closing")}>
								<S.TemplateCard
									style={{
										...transformDifferenceBtwSmallTemplateAndGridTemplate.startResizeObserver.getSize(),
										top: transformDifferenceBtwSmallTemplateAndGridTemplate.getStartOffset().top,
										left: transformDifferenceBtwSmallTemplateAndGridTemplate.getStartOffset().left,
										x: iteration9.interpolations.closing.to(
											(value) => transformDifferenceBtwSmallTemplateAndGridTemplate.getPosition().x * value
										),
										y: iteration9.interpolations.closing.to(
											(value) => transformDifferenceBtwSmallTemplateAndGridTemplate.getPosition().y * value
										),
										opacity: iteration9.interpolations.closing
											.to((value) => iterationControls.toRange(value, 0.99, 1))
											.to((value) => 1 - value),
									}}>
									<Image src={getRasterImageByName("CarTemplateSource")} />
								</S.TemplateCard>
							</VisibilitySwitch>
						)}
					</Observer>
					<PromoContainer>
						<Observer>
							{() => (
								<VisibilitySwitch visible={iteration0.visible()}>
									<S.PromoWrapper>
										<Promo />
									</S.PromoWrapper>
								</VisibilitySwitch>
							)}
						</Observer>
						<Observer>
							{() => (
								<VisibilitySwitch visible={iteration8.started()}>
									<S.PhoneWrapper $alternative>
										<PhoneTemplates
											shiftedTemplateCardRef={transformDifferenceBtwSmallTemplateAndGridTemplate.startRef}
											templateCardRef={transformDifferenceBtwSmallTemplateAndPhoneTemplate.endRef}
										/>
									</S.PhoneWrapper>
								</VisibilitySwitch>
							)}
						</Observer>
						<Observer>
							{() => (
								<VisibilitySwitch visible={iteration3.started() && !iteration8.started()}>
									<S.PhoneWrapper>
										<PhoneAssistant
											startAssistantFaceWrapperRef={mergeRefs(
												transformDifferenceBtwFaceAndPhoneFace.endRef,
												transformDifferenceBtwPhoneFaceAndShiftedPhoneFace.startRef
											)}
											shiftedAssistantFaceWrapperRef={
												transformDifferenceBtwPhoneFaceAndShiftedPhoneFace.endRef
											}
											executorFaceWrapperRef={transformDifferenceBtwExecutorFaceAndExecutorPhoneFace.endRef}
										/>
									</S.PhoneWrapper>
								</VisibilitySwitch>
							)}
						</Observer>
						<S.StartCarTemplatePosition
							ref={transformDifferenceBtwBigTemplateAndSmallTemplate.startRef}
						/>
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
											executorFaceRef={transformDifferenceBtwExecutorFaceAndExecutorPhoneFace.startRef}
											renderFace={({ Component, data }) => (
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
									<Assistant
										faceWrapperRef={transformDifferenceBtwFaceAndPhoneFace.startRef}
										renderFace={() => (
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
										)}
									/>
								</VisibilitySwitch>
							)}
						</Observer>
					</PromoContainer>
				</S.LayerWrapper>
			</S.Sandbox>
			<S.FooterWrapper
				style={{ y: lastIteration.interpolations.opening.to((value) => `${(1 - value) * 100}%`) }}>
				<Footer scrollingElementRef={iterationControls.footerRef} />
			</S.FooterWrapper>
		</>
	);
};
