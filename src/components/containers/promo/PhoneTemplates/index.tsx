import { memo } from "react";
import { a } from "react-spring";
import { Observer } from "mobx-react-lite";

import { AnimatedSplitChars } from "@components/common/ordinary/AnimatedSplitChars";
import { PhoneCard } from "@components/common/ordinary/PhoneCard";

import { Iteration } from "@components/common/hoc/Iteration";
import { VisibilitySwitch } from "@components/common/hoc/VisibilitySwitch";

import { Button } from "@components/common/ui/Button";
import { Image } from "@components/common/ui/Image";

import { useResizeObserver } from "@core/hooks";
import { toRange, mergeRefs, inlineSwitch } from "@core/utils";

import * as S from "./styled";

interface Template {
	source: string;
	overlaySource?: string;
}

export interface Props {
	templates: Template[];
	templateContainerRef?: React.ForwardedRef<any>;
	shiftedTemplateContainerRef?: React.ForwardedRef<any>;
}

export const PhoneTemplates: React.FC<Props> = memo(
	({ templates, templateContainerRef, shiftedTemplateContainerRef }) => {
		const cardResizeObserver = useResizeObserver();

		return (
			<Iteration
				iteration={[7, 9]}
				visibleCondition={(iteration7, iteration9) => iteration7.startClosed() && !iteration9.ended()}>
				{(iteration7, iteration9) => (
					<a.div
						style={{
							opacity: iteration9.interpolations
								.toEasing("easeInOutCubic")
								.closing.to((value) => 1 - value),
						}}>
						<PhoneCard
							openingInterpolation={iteration7.interpolations
								.toEasing("easeInOutCubic")
								.closing.to((value) => toRange(value, 0.99, 1))}
							backgroundZoomInterpolation={iteration7.interpolations
								.toEasing("easeInOutCubic")
								.closing.to((value) => toRange(value, 0.99, 1))}
							hiddenContent
							alternative>
							<S.DescriptionWrapper>
								<Iteration iteration={8}>
									{(iteration8) => (
										<S.Description>
											<Observer>
												{() => (
													<AnimatedSplitChars
														content={["You can", "track progress", "in real time on your phone"]}
														openingInterpolation={iteration8.interpolations.toEasing("easeInOutCubic").opening}
														closingInterpolation={iteration8.interpolations.toEasing("easeInOutCubic").closing}
														type={iteration8.currentType()}
													/>
												)}
											</Observer>
										</S.Description>
									)}
								</Iteration>
								<Iteration iteration={9}>
									{(iteration9) => (
										<S.Description $overlay>
											<Observer>
												{() => (
													<AnimatedSplitChars
														content={["Your", "presentation", "is done!"]}
														openingInterpolation={iteration9.interpolations.toEasing("easeInOutCubic").opening}
														closingInterpolation={iteration9.interpolations.toEasing("easeInOutCubic").closing}
														type={iteration9.currentType()}
													/>
												)}
											</Observer>
										</S.Description>
									)}
								</Iteration>
							</S.DescriptionWrapper>
							<Iteration iteration={[8, 9]} visibleCondition={(_, iteration9) => !iteration9.ended()}>
								{(iteration8, iteration9) => (
									<S.CardsWrapper>
										<S.ReadyTemplatesCards>
											<VisibilitySwitch visible={false}>
												<S.CardWrapper $overlay>
													<S.Card>
														<S.CardImage ref={mergeRefs(templateContainerRef, cardResizeObserver.ref)} />
													</S.Card>
												</S.CardWrapper>
											</VisibilitySwitch>
											<VisibilitySwitch visible={false}>
												<S.CardWrapper $overlay>
													<S.Card style={{ y: getCardTranslate(1, 0) }}>
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
																		y: iteration9.interpolations
																			.toEasing("easeInOutCubic")
																			.opening.to((value) => getCardTranslate(value, index)),
																		scale: iteration9.interpolations
																			.toEasing("easeInOutCubic")
																			.opening.to((value) => 1 - 0.1 * index * value),
																		opacity: inlineSwitch(
																			index === 0 && iteration9.startClosed(),
																			iteration9.interpolations
																				.toEasing("easeInOutCubic")
																				.closing.to((value) => toRange(value, 0, 0.01))
																				.to((value) => 1 - value),
																			iteration9.interpolations
																				.toEasing("easeInOutCubic")
																				.opening.to((value) => 1 - (index / templates.length) * value)
																		),
																	}}>
																	<S.CardImage style={{ height: cardResizeObserver.getSize().height }}>
																		<Image src={template.source} />
																	</S.CardImage>
																	{template.overlaySource && (
																		<S.OverlayCardContent>
																			<S.OverlayCardImage
																				style={{
																					height: iteration8.interpolations
																						.toEasing("easeInOutCubic")
																						.closing.to((value) => `${(1 - value) * 100}%`),
																				}}>
																				<S.CardImage style={{ height: cardResizeObserver.getSize().height }}>
																					<Image src={template.overlaySource} />
																				</S.CardImage>
																			</S.OverlayCardImage>
																			<S.Scan
																				style={{
																					opacity: iteration8.interpolations
																						.toEasing("easeInOutCubic")
																						.closing.to((value) => toRange(value, 0.95, 1))
																						.to((value) => 1 - value),
																					y: iteration8.interpolations
																						.toEasing("easeInOutCubic")
																						.closing.to((value) => `${(1 - value) * 100}%`),
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
							<Iteration iteration={9} visibleCondition={(iteration9) => iteration9.started()}>
								{(iteration9) => (
									<S.ButtonWrapper
										style={{
											y: iteration9.interpolations
												.toEasing("easeInOutCubic")
												.opening.to((value) => `${5 * (1 - value)}rem`),
											opacity: iteration9.interpolations.toEasing("easeInOutCubic").opening,
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

function getCardTranslate(value: number, index: number) {
	return index === 0 ? `${20 * value}%` : `-${index * 117.5 * value - 20 * value}%`;
}
