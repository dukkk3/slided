import { forwardRef } from "react";
import { a } from "react-spring";
import { Observer } from "mobx-react-lite";

import { AnimatedSplitChars } from "@components/common/ordinary/AnimatedSplitChars";
import { PhoneCard } from "@components/common/ordinary/PhoneCard";

import { Iteration } from "@components/common/hoc/Iteration";
import { VisibilitySwitch } from "@components/common/hoc/VisibilitySwitch";

import { Button } from "@components/common/ui/Button";
import { Image } from "@components/common/ui/Image";

import { useBreakpoint } from "@core/hooks/useBreakpoint";
import { useLocalStore } from "@core/hooks/useLocalStore";
import { useResizeObserver } from "@core/hooks/useResizeObserver";
import { interpolations } from "@core/helpers/iteration.helper";
import { mergeRefs } from "@core/utils/common.utils";

import * as S from "./styled";

interface Template {
	source: string;
	overlaySource?: string;
}

export interface Props {
	templates: Template[];
	templateContainerRef: React.ForwardedRef<any>;
	shiftedTemplateContainerRef: React.ForwardedRef<any>;
}

export const PhoneTemplates = forwardRef<HTMLDivElement, Props>(
	({ templates, templateContainerRef, shiftedTemplateContainerRef }, ref) => {
		const cardResizeObserver = useResizeObserver({ calculateSizeWithPaddings: true, debounce: 100 });
		const breakpoint = useBreakpoint();

		const localStore = useLocalStore({
			get cardOffset() {
				return breakpoint.mobile() ? 40 : 20;
			},
		});

		return (
			<Iteration
				iterations={[7, 9]}
				checkForVisible={([iteration7, iteration9]) => iteration7.startClosed() && !iteration9.ended()}>
				{([iteration7, iteration9]) => (
					<a.div
						style={{
							opacity: iteration9.interpolations.closing
								.to(interpolations.easing("easeInOutCubic"))
								.to(interpolations.invert),
						}}>
						<PhoneCard
							ref={ref}
							openingInterpolation={iteration7.interpolations.closing
								.to(interpolations.easing("easeInOutCubic"))
								.to(interpolations.range(0.99, 1))}
							backgroundZoomInterpolation={iteration7.interpolations.closing
								.to(interpolations.easing("easeInOutCubic"))
								.to(interpolations.range(0.99, 1))}
							hiddenContent
							alternative>
							<S.DescriptionWrapper>
								<Iteration iterations={8}>
									{([iteration8]) => (
										<S.Description>
											<Observer>
												{() => (
													<AnimatedSplitChars
														content={["You can", "track progress", "in real time on your phone"]}
														openingInterpolation={iteration8.interpolations.opening.to(
															interpolations.easing("easeInOutCubic")
														)}
														closingInterpolation={iteration8.interpolations.closing.to(
															interpolations.easing("easeInOutCubic")
														)}
														type={iteration8.currentState()}
													/>
												)}
											</Observer>
										</S.Description>
									)}
								</Iteration>
								<Iteration iterations={[9]}>
									{([iteration9]) => (
										<S.Description $overlay>
											<Observer>
												{() => (
													<AnimatedSplitChars
														content={["Your", "presentation", "is done!"]}
														openingInterpolation={iteration9.interpolations.opening.to(
															interpolations.easing("easeInOutCubic")
														)}
														closingInterpolation={iteration9.interpolations.closing.to(
															interpolations.easing("easeInOutCubic")
														)}
														type={iteration9.currentState()}
													/>
												)}
											</Observer>
										</S.Description>
									)}
								</Iteration>
							</S.DescriptionWrapper>
							<Iteration iterations={[8, 9]} checkForVisible={([, iteration9]) => !iteration9.ended()}>
								{([iteration8, iteration9]) => (
									<S.CardsWrapper>
										<S.ReadyTemplatesCards>
											<VisibilitySwitch visible={false}>
												<S.CardWrapper $overlay>
													<S.Card>
														<S.CardImage
															data-card
															ref={mergeRefs(templateContainerRef, cardResizeObserver.ref)}
														/>
													</S.Card>
												</S.CardWrapper>
											</VisibilitySwitch>
											<VisibilitySwitch visible={false}>
												<S.CardWrapper $overlay>
													<S.Card style={{ y: getCardTranslate(1, 0, localStore.cardOffset) }}>
														<S.CardImage ref={shiftedTemplateContainerRef} />
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
																			index === 0 && iteration9.startClosed()
																				? iteration9.interpolations.closing
																						.to(interpolations.easing("easeInOutCubic"))
																						.to(interpolations.step(0.001))
																						.to(interpolations.invert)
																				: iteration9.interpolations.opening
																						.to(interpolations.easing("easeInOutCubic"))
																						.to((value) => 1 - (index / templates.length) * value),
																	}}>
																	<S.CardImage style={{ height: cardResizeObserver.getSize().height }}>
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
																				<S.CardImage style={{ height: cardResizeObserver.getSize().height }}>
																					<Image src={template.overlaySource} />
																				</S.CardImage>
																			</S.OverlayCardImage>
																			<S.Scan
																				style={{
																					y: "-50%",
																					transformOrigin: "left center",
																					opacity: iteration8.interpolations.closing
																						.to(interpolations.easing("easeInOutCubic"))
																						.to(interpolations.range(0.95, 1))
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
								)}
							</Iteration>
							<Iteration iterations={9} checkForVisible={([iteration9]) => iteration9.started()}>
								{([iteration9]) => (
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
								)}
							</Iteration>
						</PhoneCard>
					</a.div>
				)}
			</Iteration>
		);
	}
);

function getCardTranslate(value: number, index: number, offset: number) {
	return index === 0 ? `${offset * value}%` : `-${index * 115 * value - offset * value}%`;
}
