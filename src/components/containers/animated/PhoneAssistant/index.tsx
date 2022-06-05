import { memo } from "react";
import { a, useSpring, easings } from "react-spring";
import { Observer } from "mobx-react-lite";

import { PhoneCard } from "@components/promo/PhoneCard";
import { TemplatesCards } from "@components/promo/TemplatesCards";
import { AnimatedSplitChars } from "@components/promo/AnimatedSplitChars";

import { VisibilitySwitch } from "@components/common/hoc/VisibilitySwitch";

import { Button } from "@components/common/ui/Button";

import { useIteration, useIterationControls } from "@core/hooks";

import * as S from "./styled";

export interface Props {
	startAssistantFaceWrapperRef?: React.ForwardedRef<any>;
	shiftedAssistantFaceWrapperRef?: React.ForwardedRef<any>;
	executorFaceWrapperRef?: React.ForwardedRef<any>;
}

export const PhoneAssistant: React.FC<Props> = memo(
	({ startAssistantFaceWrapperRef, shiftedAssistantFaceWrapperRef, executorFaceWrapperRef }) => {
		const { scaleProgress: locatorPulse } = useSpring({
			from: { scaleProgress: 0.3 },
			to: { scaleProgress: 1 },
			config: { duration: 1500, easing: easings.linear },
			loop: true,
		});

		const iterationControls = useIterationControls();

		const iteration3 = useIteration(3);
		const iteration4 = useIteration(4);
		const iteration5 = useIteration(5);
		const iteration6 = useIteration(6);

		return (
			<>
				<PhoneCard
					openingInterpolation={iteration3.interpolations.opening}
					backgroundZoomInterpolation={iteration4.interpolations.opening}>
					<S.Face>
						<S.FaceWrapper ref={startAssistantFaceWrapperRef} />
						<S.FaceWrapper
							ref={shiftedAssistantFaceWrapperRef}
							style={{ transform: "translateX(-40%)" }}
						/>
						<S.FaceWrapper ref={executorFaceWrapperRef} style={{ transform: "translateX(40%)" }} />
					</S.Face>
					<S.DescriptionWrapper>
						<Observer>
							{() => (
								<VisibilitySwitch visible={iteration3.started() && !iteration4.ended()}>
									<S.Description>
										<AnimatedSplitChars
											content={["Choose a style", "from ready-made", "templates"]}
											openingInterpolation={iteration3.interpolations.opening}
											closingInterpolation={iteration4.interpolations.closing}
											type={iteration3.visible() || iteration4.visible("opening") ? "opening" : "closing"}
										/>
									</S.Description>
								</VisibilitySwitch>
							)}
						</Observer>
						<Observer>
							{() => (
								<VisibilitySwitch visible={iteration5.visible()}>
									<S.Description $overlay>
										<AnimatedSplitChars
											content={["Our selected", "designers are on", "the mission to get", "your task done"]}
											openingInterpolation={iteration5.interpolations.opening}
											closingInterpolation={iteration5.interpolations.closing}
											type={iteration5.visible("opening") ? "opening" : "closing"}
										/>
									</S.Description>
								</VisibilitySwitch>
							)}
						</Observer>
						<Observer>
							{() => (
								<VisibilitySwitch visible={iteration6.started()}>
									<S.Description $overlay $big>
										<AnimatedSplitChars
											content={["Slide it to", "make it"]}
											openingInterpolation={iteration6.interpolations.opening}
											closingInterpolation={iteration6.interpolations.closing.to((value) => 0)}
											type={iteration6.visible("opening") ? "opening" : "closing"}
										/>
									</S.Description>
								</VisibilitySwitch>
							)}
						</Observer>
					</S.DescriptionWrapper>
					<Observer>
						{() => (
							<VisibilitySwitch visible={iteration3.started() && !iteration4.ended()}>
								<S.Cards
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
								</S.Cards>
							</VisibilitySwitch>
						)}
					</Observer>
					<S.ButtonWrapper>
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
											<Button onClick={iterationControls.next}>Choose</Button>
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
											<Button theme='grey' style={{ cursor: "default" }}>
												Searching the best...
											</Button>
										</a.div>
									</VisibilitySwitch>
									<VisibilitySwitch visible={iteration6.started()}>
										<a.div
											style={{
												opacity: iteration6.started() ? iteration6.interpolations.opening : 1,
											}}>
											<S.Slide onClick={iterationControls.next}>
												<S.SlideContent
													style={{ x: iteration6.interpolations.closing.to((value) => `${value * 100}%`) }}
												/>
											</S.Slide>
										</a.div>
									</VisibilitySwitch>
								</>
							)}
						</Observer>
					</S.ButtonWrapper>
				</PhoneCard>
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
			</>
		);
	}
);
