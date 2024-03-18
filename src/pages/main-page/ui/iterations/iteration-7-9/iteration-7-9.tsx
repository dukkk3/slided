import { useUnit } from "effector-react";

import { interpolators, springUtils } from "@shared/helpers";
import { VisibilityToggler } from "@shared/ui";
import { common } from "@shared/utils";

import { IterationContainer } from "../../iteration-container";

import { PRESENTATIONS, OFFSET_BETWEEN_CARDS } from "./iteration-7-9.config";
import { calculateCardTranslate } from "./iteration-7-9.lib";
import * as model from "./iteration-7-9.model";
import * as S from "./iteration-7-9.styled";

export const Iteration7_9 = () => {
	const isVisible = useUnit(model.$inRange7_9);

	return (
		<VisibilityToggler isHidden={!isVisible}>
			<IterationContainer>
				<S.PhoneWrapper
					style={{
						opacity: model.iteration9.closing.progress
							.to(interpolators.toEased("easeInOutCubic"))
							.to(interpolators.toInverted),
					}}>
					<S.Phone
						openingProgress={model.iteration7.closing.progress
							.to(interpolators.toRanged(0.99, 1))
							.to(interpolators.toEased("easeInOutCubic"))}
						hiddenContent
						alternative>
						<Description />
						<Presentations />
						<PhoneFooter />
					</S.Phone>
				</S.PhoneWrapper>
			</IterationContainer>
		</VisibilityToggler>
	);
};

const Presentations = () => {
	const isVisible = !useUnit(model.$iteration9.closing.$ended);
	const isIteration9ClosingStarted = useUnit(model.$iteration9.closing.$started);
	const [inPhonePresentationRef] = model.usePresentationShapeRect("in-phone");
	const [inPhoneShiftedPresentationRef] = model.usePresentationShapeRect("in-phone-shifted");
	const [presentationCardRef, presentationCardRect] = model.usePresentationCardRectOf();

	return (
		<VisibilityToggler isHidden={!isVisible}>
			<S.PresentationCardsWrapper>
				<S.DonePresentationCards>
					<VisibilityToggler isHidden>
						<S.PresentationWrapper $overlay>
							<S.PresentationCard>
								<S.Presentation ref={common.mergeRefs(inPhonePresentationRef, presentationCardRef)} />
							</S.PresentationCard>
						</S.PresentationWrapper>
					</VisibilityToggler>
					<VisibilityToggler isHidden>
						<S.PresentationWrapper $overlay>
							<S.PresentationCard style={{ y: calculateCardTranslate(1, 0, OFFSET_BETWEEN_CARDS) }}>
								<S.Presentation ref={inPhoneShiftedPresentationRef} />
							</S.PresentationCard>
						</S.PresentationWrapper>
					</VisibilityToggler>
					{PRESENTATIONS.map((presentation, index) => (
						<S.PresentationWrapper key={index} style={{ zIndex: PRESENTATIONS.length - index }}>
							<S.PresentationCard
								style={springUtils.optimizeStyleForRendering({
									y: model.iteration9.opening.progress
										.to(interpolators.toEased("easeInOutCubic"))
										.to((value) => calculateCardTranslate(value, index, OFFSET_BETWEEN_CARDS)),
									scale: model.iteration9.opening.progress
										.to(interpolators.toEased("easeInOutCubic"))
										.to(interpolators.toScaledOn(0.1 * index))
										.to(interpolators.toInverted),
									opacity: common.variant({
										if: index === 0 && isIteration9ClosingStarted,
										then: model.iteration9.closing.progress
											.to(interpolators.toStepped(0.001))
											.to(interpolators.toEased("easeInOutCubic"))
											.to(interpolators.toInverted),
										else: model.iteration9.opening.progress
											.to(interpolators.toEased("easeInOutCubic"))
											.to(interpolators.toScaledOn(index / PRESENTATIONS.length))
											.to(interpolators.toInverted),
									}),
								})}>
								<S.Presentation style={{ height: presentationCardRect.height }} src={presentation.src} />
								{presentation.overlaySrc && (
									<S.PresentationOverlayCardContent>
										<S.PresentationOverlayWrapper
											style={springUtils.optimizeStyleForRendering({
												height: model.iteration8.closing.progress
													.to(interpolators.toEased("easeInOutCubic"))
													.to(interpolators.toInverted)
													.to(interpolators.toScaledOn(100))
													.to(interpolators.toPercents),
											})}>
											<S.Presentation
												style={{ height: presentationCardRect.height }}
												src={presentation.overlaySrc}
											/>
										</S.PresentationOverlayWrapper>
										<S.Scan
											style={springUtils.optimizeStyleForRendering({
												y: "-50%",
												transformOrigin: "left center",
												opacity: model.iteration8.closing.progress
													.to(interpolators.toRanged(0.95, 1))
													.to(interpolators.toEased("easeInOutCubic"))
													.to(interpolators.toInverted),
												top: model.iteration8.closing.progress
													.to(interpolators.toEased("easeInOutCubic"))
													.to(interpolators.toInverted)
													.to(interpolators.toScaledOn(100))
													.to(interpolators.toPercents),
											})}
										/>
									</S.PresentationOverlayCardContent>
								)}
							</S.PresentationCard>
						</S.PresentationWrapper>
					))}
				</S.DonePresentationCards>
			</S.PresentationCardsWrapper>
		</VisibilityToggler>
	);
};

const Description = () => {
	const iteration8Status = useUnit(model.$iteration8Status);
	const iteration8OpeningStatus = useUnit(model.$iteration8.opening.$inFlight);
	const iteration9Status = useUnit(model.$iteration9Status);
	const iteration9OpeningStatus = useUnit(model.$iteration9.opening.$inFlight);

	return (
		<S.Descriptions>
			<VisibilityToggler isHidden={!iteration8Status}>
				<S.Description
					words={["You can", "track progress", "in real time on your phone"]}
					openingProgress={model.iteration8.opening.progress.to(interpolators.toEased("easeInOutCubic"))}
					closingProgress={model.iteration8.closing.progress.to(interpolators.toEased("easeInOutCubic"))}
					isOpening={iteration8OpeningStatus}
				/>
			</VisibilityToggler>
			<VisibilityToggler isHidden={!iteration9Status}>
				<S.Description
					words={["Your", "presentation", "is done!"]}
					openingProgress={model.iteration9.opening.progress.to(interpolators.toEased("easeInOutCubic"))}
					closingProgress={model.iteration9.closing.progress.to(interpolators.toEased("easeInOutCubic"))}
					isOpening={iteration9OpeningStatus}
					$withAbsolutePosition
				/>
			</VisibilityToggler>
		</S.Descriptions>
	);
};

const PhoneFooter = () => {
	const isVisible = useUnit(model.$iteration9.opening.$started);

	return (
		<VisibilityToggler isHidden={!isVisible}>
			<S.PhoneFooter>
				<S.Button
					style={springUtils.optimizeStyleForRendering({
						y: model.iteration9.opening.progress
							.to(interpolators.toEased("easeInOutCubic"))
							.to(interpolators.toInverted)
							.to(interpolators.toScaledOn(50)),
						opacity: model.iteration9.opening.progress.to(interpolators.toEased("easeInOutCubic")),
					})}>
					Download
				</S.Button>
			</S.PhoneFooter>
		</VisibilityToggler>
	);
};
