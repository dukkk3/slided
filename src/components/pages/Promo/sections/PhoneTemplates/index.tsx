import { forwardRef } from "react";
import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/pages/Promo/helpers/Iteration";

import { VisibilitySwitch } from "@components/common/ui/VisibilitySwitch";
import { Button } from "@components/common/ui/Button";
import { Image } from "@components/common/ui/Image";

import { useBreakpoint } from "@core/hooks/useBreakpoint";
import { useLocalStore } from "@core/hooks/useLocalStore";
import { interpolations } from "@core/helpers/iteration.helper";
import { mergeRefs } from "@core/utils/common.utils";

import { AnimatedSplitChars } from "../../helpers/AnimatedSplitChars";
import { Phone } from "../../shared/Phone";

import { usePromo } from "../../index";

import * as S from "./styled";

export interface Template {
	source: string;
	overlaySource?: string;
}

export interface Props {
	templates: Template[];
}

export const PhoneTemplates = forwardRef<HTMLDivElement, Props>(({ templates }, ref) => {
	const promo = usePromo();
	const breakpoint = useBreakpoint();

	const localStore = useLocalStore({
		get cardOffset() {
			return breakpoint.mobile() ? 40 : 20;
		},
	});

	return (
		<Iteration
			iterations={[7, 8, 9]}
			checkForVisible={([iteration7, , iteration9]) =>
				iteration7.closeStarted() && !iteration9.ended()
			}>
			{([iteration7, iteration8, iteration9]) => (
				<S.PhoneGroup
					data-iteration-name='PhoneTemplates'
					style={{
						opacity: iteration9.interpolations.closing
							.to(interpolations.easing("easeInOutCubic"))
							.to(interpolations.invert),
					}}>
					<Phone
						ref={ref}
						openingInterpolation={iteration7.interpolations.closing
							.to(interpolations.range(0.99, 1))
							.to(interpolations.easing("easeInOutCubic"))}
						hiddenContent
						alternative>
						<S.DescriptionGroup>
							<Observer>
								{() => (
									<VisibilitySwitch visible={iteration8.visible()}>
										<S.Description>
											<AnimatedSplitChars
												text={
													breakpoint.mobile()
														? ["Track progress in real", "time on your phone"]
														: ["You can", "track progress", "in real time on your phone"]
												}
												openingInterpolation={iteration8.interpolations.opening.to(
													interpolations.easing("easeInOutCubic")
												)}
												closingInterpolation={iteration8.interpolations.closing.to(
													interpolations.easing("easeInOutCubic")
												)}
												type={iteration8.currentState()}
											/>
										</S.Description>
									</VisibilitySwitch>
								)}
							</Observer>
							<Observer>
								{() => (
									<VisibilitySwitch visible={iteration9.visible()}>
										<S.Description $overlay>
											<AnimatedSplitChars
												text={
													breakpoint.mobile()
														? ["Your presentation", "is done!"]
														: ["Your", "presentation", "is done!"]
												}
												openingInterpolation={iteration9.interpolations.opening.to(
													interpolations.easing("easeInOutCubic")
												)}
												closingInterpolation={iteration9.interpolations.closing.to(
													interpolations.easing("easeInOutCubic")
												)}
												type={iteration9.currentState()}
											/>
										</S.Description>
									</VisibilitySwitch>
								)}
							</Observer>
						</S.DescriptionGroup>
						<Observer>
							{() => (
								<VisibilitySwitch visible={!iteration9.ended()}>
									<S.CardsWrapper>
										<S.ReadyTemplatesCards>
											<VisibilitySwitch visible={false}>
												<S.CardWrapper $overlay>
													<S.Card>
														<S.CardImage
															ref={mergeRefs(
																promo.transforms.bigTemplateAndPhoneTemplate.endRef,
																promo.resizeObservers.phoneCard.ref
															)}
														/>
													</S.Card>
												</S.CardWrapper>
											</VisibilitySwitch>
											<VisibilitySwitch visible={false}>
												<S.CardWrapper $overlay>
													<S.Card style={{ y: getCardTranslate(1, 0, localStore.cardOffset) }}>
														<S.CardImage ref={promo.transforms.phoneTemplateAndGridTemplate.startRef} />
													</S.Card>
												</S.CardWrapper>
											</VisibilitySwitch>
											<Observer>
												{() => (
													<>
														{templates.map((template, index) => (
															<S.CardWrapper key={index} style={{ zIndex: templates.length - index }}>
																<S.Card
																	style={{
																		y: iteration9.interpolations.opening
																			.to(interpolations.easing("easeInOutCubic"))
																			.to((value) => getCardTranslate(value, index, localStore.cardOffset)),
																		scale: iteration9.interpolations.opening
																			.to(interpolations.easing("easeInOutCubic"))
																			.to((value) => 1 - 0.1 * index * value),
																		opacity:
																			index === 0 && iteration9.closeStarted()
																				? iteration9.interpolations.closing
																						.to(interpolations.step(0.001))
																						.to(interpolations.easing("easeInOutCubic"))
																						.to(interpolations.invert)
																				: iteration9.interpolations.opening
																						.to(interpolations.easing("easeInOutCubic"))
																						.to((value) => 1 - (index / templates.length) * value),
																	}}>
																	<S.CardImage style={{ height: promo.resizeObservers.phoneCard.getSize().height }}>
																		<Image src={template.source} />
																	</S.CardImage>
																	{template.overlaySource && (
																		<S.OverlayCardContent>
																			<S.OverlayCardImage
																				style={{
																					height: iteration8.interpolations.closing
																						.to(interpolations.easing("easeInOutCubic"))
																						.to(interpolations.invert)
																						.to((value) => `${value * 100}%`),
																				}}>
																				<S.CardImage
																					style={{ height: promo.resizeObservers.phoneCard.getSize().height }}>
																					<Image src={template.overlaySource} />
																				</S.CardImage>
																			</S.OverlayCardImage>
																			<S.Scan
																				style={{
																					y: "-50%",
																					transformOrigin: "left center",
																					opacity: iteration8.interpolations.closing
																						.to(interpolations.range(0.95, 1))
																						.to(interpolations.easing("easeInOutCubic"))
																						.to(interpolations.invert),
																					top: iteration8.interpolations.closing
																						.to(interpolations.easing("easeInOutCubic"))
																						.to(interpolations.invert)
																						.to((value) => `${value * 100}%`),
																				}}
																			/>
																		</S.OverlayCardContent>
																	)}
																</S.Card>
															</S.CardWrapper>
														))}
													</>
												)}
											</Observer>
										</S.ReadyTemplatesCards>
									</S.CardsWrapper>
								</VisibilitySwitch>
							)}
						</Observer>
						<Observer>
							{() => (
								<VisibilitySwitch visible={iteration9.started()}>
									<S.ButtonWrapper
										style={{
											y: iteration9.interpolations.opening
												.to(interpolations.easing("easeInOutCubic"))
												.to(interpolations.invert)
												.to((value) => `${5 * value}rem`),
											opacity: iteration9.interpolations.opening.to(interpolations.easing("easeInOutCubic")),
										}}>
										<Button>Download</Button>
									</S.ButtonWrapper>
								</VisibilitySwitch>
							)}
						</Observer>
					</Phone>
				</S.PhoneGroup>
			)}
		</Iteration>
	);
});

function getCardTranslate(value: number, index: number, offset: number) {
	return index === 0 ? `${offset * value}%` : `-${index * 115 * value - offset * value}%`;
}
