import { useEffect, forwardRef, useRef } from "react";
import { Observer } from "mobx-react-lite";
import { a, useSpring } from "react-spring";
import { reaction } from "mobx";

import { PhoneCard } from "@components/common/ordinary/PhoneCard";
import { AnimatedSplitChars } from "@components/common/ordinary/AnimatedSplitChars";

import { Iteration } from "@components/common/hoc/Iteration";
import { VisibilitySwitch } from "@components/common/hoc/VisibilitySwitch";

import { Button } from "@components/common/ui/Button";
import { Image } from "@components/common/ui/Image";

import { useIterationsControls } from "@core/hooks/useIterationsControls";
import { useBreakpoint } from "@core/hooks/useBreakpoint";
import { useIteration } from "@core/hooks/useIteration";
import { useLocalStore } from "@core/hooks/useLocalStore";
import { interpolations } from "@core/helpers/iteration.helper";

import { getVectorImageByName } from "@assets/images";

import { useDrag } from "@use-gesture/react";
import { useResizeObserver } from "@core/hooks/useResizeObserver";
import { mergeRefs } from "@core/utils/common.utils";
import { clamp } from "@core/utils/math.utils";

import * as S from "./styled";

export interface Props {
	templates: string[];
	cardsContainerRef?: React.ForwardedRef<any>;
	executorContainerRef?: React.ForwardedRef<any>;
	assistantContainerRef?: React.ForwardedRef<any>;
	shiftedAssistantContainerRef?: React.ForwardedRef<any>;
}

export const PhoneAssistant = forwardRef<HTMLDivElement, Props>(
	(
		{
			templates,
			cardsContainerRef,
			assistantContainerRef,
			shiftedAssistantContainerRef,
			executorContainerRef,
		},
		ref
	) => {
		const iteration3 = useIteration(3);
		const breakpoint = useBreakpoint();
		const iterationsControls = useIterationsControls();

		const localStore = useLocalStore({
			cardsWereShown: false,
		});

		useEffect(
			() =>
				reaction(
					() => iteration3.opened(),
					(opened) => {
						if (localStore.cardsWereShown) return;
						localStore.setCardsWereShown(opened);
					}
				),
			[iteration3, localStore]
		);

		return (
			<Iteration
				iterations={[3, 4, 7, 8]}
				checkForVisible={([iteration3, , , iteration8]) =>
					iteration3.started() && !iteration8.started()
				}>
				{([iteration3, iteration4, iteration7]) => (
					<a.div
						style={{
							opacity: iteration7.interpolations.opening
								.to(interpolations.easing("easeInOutCubic"))
								.to(interpolations.step(0.45))
								.to(interpolations.invert),
						}}>
						<PhoneCard
							ref={ref}
							openingInterpolation={iteration3.interpolations.opening.to(
								interpolations.easing("easeInOutCubic")
							)}
							backgroundZoomInterpolation={iteration4.interpolations.opening.to(
								interpolations.easing("easeInOutCubic")
							)}>
							<S.Content>
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
														openingInterpolation={iteration3.interpolations.opening.to(
															interpolations.easing("easeInOutCubic")
														)}
														closingInterpolation={iteration4.interpolations.closing.to(
															interpolations.easing("easeInOutCubic")
														)}
														type={iteration3.visible() || iteration4.visible("opening") ? "opening" : "closing"}
													/>
												</S.Description>
											</VisibilitySwitch>
										)}
									</Observer>
									<Iteration iterations={5}>
										{([iteration5]) => (
											<S.Description $overlay>
												<Observer>
													{() => (
														<AnimatedSplitChars
															content={[
																"Our selected",
																"designers are on",
																"the mission to get",
																"your task done",
															]}
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
										)}
									</Iteration>
									<Iteration
										iterations={[6, 7]}
										checkForVisible={([iteration6, iteration7]) =>
											iteration6.started() && !iteration7.ended()
										}>
										{([iteration6]) => (
											<S.Description $overlay $big>
												<Observer>
													{() => (
														<AnimatedSplitChars
															content={["Designer", "is ready", "to start"]}
															openingInterpolation={iteration6.interpolations.opening.to(
																interpolations.easing("easeInOutCubic")
															)}
															closingInterpolation={iteration6.interpolations.closing.to(() => 0)}
															type={iteration6.currentState()}
														/>
													)}
												</Observer>
											</S.Description>
										)}
									</Iteration>
								</S.DescriptionWrapper>
								<Iteration
									iterations={[3, 4]}
									checkForVisible={([iteration3, iteration4]) =>
										iteration3.started() && !iteration4.ended()
									}>
									{([iteration3, iteration4]) => (
										<div ref={cardsContainerRef}>
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
															{templates
																.map((templateSource, index) => ({
																	templateSource,
																	...getCardProps(index, templates.length),
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
																			cardsAmount: templates.length,
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
									)}
								</Iteration>
								<S.ButtonWrapper>
									<Iteration
										iterations={[3, 4]}
										checkForVisible={([iteration3, iteration4]) =>
											iteration3.startClosed() && !iteration4.ended()
										}>
										{([iteration3, iteration4]) => (
											<a.div
												className='unit'
												style={{
													opacity: iteration3.visible()
														? iteration3.interpolations.closing.to(interpolations.easing("easeInOutCubic"))
														: iteration4.interpolations.closing
																.to(interpolations.easing("easeInOutCubic"))
																.to(interpolations.range(0, 0.5))
																.to(interpolations.invert),
												}}>
												<Button onClick={iterationsControls.next}>Choose</Button>
											</a.div>
										)}
									</Iteration>
									<Iteration
										iterations={[4, 5]}
										checkForVisible={([iteration4, iteration5]) =>
											iteration4.startClosed() && !iteration5.ended()
										}
										switchVisibility={{ interactive: false }}>
										{([iteration4, iteration5]) => (
											<div>
												<Observer>
													{() =>
														!breakpoint.mobile() ? (
															<a.div
																className='unit'
																style={{
																	opacity: iteration4.visible("closing")
																		? iteration4.interpolations.closing
																				.to(interpolations.easing("easeInOutCubic"))
																				.to(interpolations.range(0, 0.5))
																		: iteration5.interpolations.closing
																				.to(interpolations.easing("easeInOutCubic"))
																				.to(interpolations.invert),
																}}>
																<Button theme='grey'>Searching the best...</Button>
															</a.div>
														) : null
													}
												</Observer>
											</div>
										)}
									</Iteration>
									<Iteration iterations={6} checkForVisible={([iteration6]) => iteration6.started()}>
										{([iteration6]) => (
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
															state={!iteration6.startClosed() ? "active" : "inactive"}
															onSwipeEnded={iterationsControls.next}
														/>
													)}
												</Observer>
											</a.div>
										)}
									</Iteration>
								</S.ButtonWrapper>
							</S.Content>
						</PhoneCard>
					</a.div>
				)}
			</Iteration>
		);
	}
);

interface SlideButtonProps {
	state: "active" | "inactive";
	onSwipeEnded?: () => void;
}

const SlideButton: React.FC<SlideButtonProps> = ({ state, onSwipeEnded }) => {
	const [buttonStyle, buttonApi] = useSpring(
		() => ({
			x: state === "active" ? 0 : 1,
			onRest: {
				x: (value: any) => {
					if (value.value === 1 && onSwipeEnded) onSwipeEnded();
				},
			},
		}),
		[state]
	);
	const buttonGroupResizeObserver = useResizeObserver({
		debounce: 100,
		calculateSizeWithPaddings: true,
	});
	const buttonRef = useRef<any>(null);

	useDrag(
		({ dragging, movement: [mx], cancel, canceled }) => {
			if (state !== "active") return;

			const realProgress = mx / buttonGroupResizeObserver.getSize().width;
			let progress = realProgress;

			if (!dragging && !canceled) progress = 0;
			if (realProgress >= 0.55) progress = 1;
			// if (vx > 5) progress = 1;

			if (progress === 0 || progress >= 0.99) {
				buttonApi.start({ x: clamp(progress, 0, 1) });
			} else {
				buttonApi.set({ x: clamp(progress, 0, 1) });
			}

			if (progress >= 1) {
				cancel();
			}
		},
		{ target: buttonRef, axis: "x" }
	);

	useEffect(() => {
		// buttonApi.start({ x: "0%" });
	}, [buttonApi, state]);

	return (
		<S.Slide
			className='safari-border-radius-overflow-bugfix'
			ref={mergeRefs(buttonGroupResizeObserver.ref, buttonRef)}>
			<S.SlideContent style={{ x: buttonStyle.x.to((value) => `${value * 100}%`) }}>
				<S.SlideButton>
					<Image src={getVectorImageByName("common", "LogoRayIcoSource")} lazy={false} />
				</S.SlideButton>
			</S.SlideContent>
			<S.SlideButtonLabelGroup style={{ opacity: 1 }}>
				<S.SlideButtonLabel>Slide to answer</S.SlideButtonLabel>
			</S.SlideButtonLabelGroup>
		</S.Slide>
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