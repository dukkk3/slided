import { useUnit } from "effector-react";
import { memo } from "react";

import { interpolators, springUtils } from "@shared/helpers";
import { VisibilityToggler } from "@shared/ui";
import { common } from "@shared/utils";

import { IterationContainer } from "../../iteration-container";

import * as assets from "./assets";
import { TEMPLATES } from "./iteration-3-7.config";
import { calculateTemplateCardProps, getTemplateCardStyle } from "./iteration-3-7.lib";
import * as model from "./iteration-3-7.model";
import * as S from "./iteration-3-7.styled";

export const Iteration3_7 = () => {
	const isSectionVisible = useUnit(model.$inRange3_7);

	return (
		<VisibilityToggler isHidden={!isSectionVisible}>
			<IterationContainer>
				<S.PhoneWrapper
					style={springUtils.optimizeStyleForRendering({
						opacity: model.iteration7.opening.progress
							.to(interpolators.toStepped(0.45))
							.to(interpolators.toEased("easeInOutCubic"))
							.to(interpolators.toInverted),
					})}>
					<S.Phone
						openingProgress={model.iteration3.opening.progress.to(
							interpolators.toEased("easeInOutCubic")
						)}>
						<S.Content>
							<div>
								<Face />
								<Description />
							</div>
							<S.TemplateCardsContainer>
								<Ray />
								<TemplateCards />
							</S.TemplateCardsContainer>
							<PhoneFooter />
						</S.Content>
					</S.Phone>
				</S.PhoneWrapper>
			</IterationContainer>
		</VisibilityToggler>
	);
};

const Description = memo(() => {
	const iteration3Status = useUnit(model.$iteration3Status);
	const iteration5OpeningStatus = useUnit(model.$iteration5.opening.$inFlight);
	const iteration6OpeningStatus = useUnit(model.$iteration6.opening.$inFlight);
	const iteration5Status = useUnit(model.$iteration5Status);
	const inRange3_4 = useUnit(model.$inRange3_4);
	const inRange6_7 = useUnit(model.$inRange6_7);

	return (
		<S.Descriptions>
			<VisibilityToggler isHidden={!inRange3_4}>
				<S.Description
					words={["Choose a style", "from ready-made", "templates"]}
					openingProgress={model.iteration3.opening.progress.to(interpolators.toEased("easeInOutCubic"))}
					closingProgress={model.iteration4.closing.progress.to(interpolators.toEased("easeInOutCubic"))}
					isOpening={iteration3Status}
				/>
			</VisibilityToggler>
			<VisibilityToggler isHidden={!iteration5Status}>
				<S.Description
					words={["Our selected", "designers are on", "the mission to get", "your task done"]}
					openingProgress={model.iteration5.opening.progress
						.to(interpolators.toClampedScaled(model.iteration5.opening.durationFactor))
						.to(interpolators.toEased("easeInOutCubic"))}
					closingProgress={model.iteration5.closing.progress
						.to(interpolators.toClampedScaled(model.iteration5.closing.durationFactor))
						.to(interpolators.toEased("easeInOutCubic"))}
					isOpening={iteration5OpeningStatus}
					$withAbsolutePosition
				/>
			</VisibilityToggler>
			<VisibilityToggler isHidden={!inRange6_7}>
				<S.BoldDescription
					words={["Designer is set", "& ready to start"]}
					openingProgress={model.iteration6.opening.progress.to(interpolators.toEased("easeInOutCubic"))}
					closingProgress={model.iteration6.closing.progress.to(() => 0)}
					isOpening={iteration6OpeningStatus}
					$withAbsolutePosition
				/>
			</VisibilityToggler>
		</S.Descriptions>
	);
});

const Face = memo(() => {
	const [assistantInPhoneRef] = model.useAssistantShapeRect("in-phone");
	const [assistantInPhonePairRef] = model.useAssistantShapeRect("in-phone-pair");
	const [designerRef] = model.useDesignerShapeRect("in-phone");

	return (
		<S.Face>
			<S.FaceContainer ref={assistantInPhoneRef} />
			<S.FaceContainer ref={assistantInPhonePairRef} style={{ transform: "translateX(-40%)" }} />
			<S.FaceContainer ref={designerRef} style={{ transform: "translateX(40%)" }} />
		</S.Face>
	);
});

const Ray = memo(() => {
	return (
		<S.RayImage
			style={springUtils.optimizeStyleForRendering({
				opacity: model.iteration6.opening.progress.to(interpolators.toEased("easeInOutCubic")),
			})}
			src={assets.ray}
		/>
	);
});

const PhoneFooter = memo(() => {
	const iteration3Status = useUnit(model.$iteration3Status);
	const iteration4ClosingStatus = useUnit(model.$iteration4.closing.$inFlight);
	const iteration6ClosingStarted = useUnit(model.$iteration6.closing.$started);
	const iteration6OpeningStarted = useUnit(model.$iteration6.opening.$started);
	const inRange4_5 = useUnit(model.$inRange4_5);
	const inRange3_4 = useUnit(model.$inRange3_4);

	return (
		<S.PhoneFooter>
			<VisibilityToggler isHidden={!inRange3_4}>
				<S.Button
					style={springUtils.optimizeStyleForRendering({
						opacity: common.variant({
							if: iteration3Status,
							then: model.iteration3.closing.progress.to(interpolators.toEased("easeInOutCubic")),
							else: model.iteration4.closing.progress
								.to(interpolators.toRanged(0, 0.5))
								.to(interpolators.toEased("easeInOutCubic"))
								.to(interpolators.toInverted),
						}),
					})}>
					Choose
				</S.Button>
			</VisibilityToggler>
			<VisibilityToggler isHidden={!inRange4_5}>
				<S.Button
					variant='grey'
					disabled
					style={springUtils.optimizeStyleForRendering({
						opacity: common.variant({
							if: iteration4ClosingStatus,
							then: model.iteration4.closing.progress
								.to(interpolators.toRanged(0, 0.5))
								.to(interpolators.toEased("easeInOutCubic")),
							else: model.iteration5.closing.progress
								.to(interpolators.toEased("easeInOutCubic"))
								.to(interpolators.toInverted),
						}),
					})}>
					Searching the best...
				</S.Button>
			</VisibilityToggler>
			<VisibilityToggler isHidden={!iteration6OpeningStarted}>
				<S.Slider
					isSwipeEnabled={!iteration6ClosingStarted}
					onSwipeEnd={() => model.iterationSlided({ direction: 1 })}
					style={springUtils.optimizeStyleForRendering({
						opacity: common.variant({
							if: iteration6OpeningStarted,
							then: model.iteration6.opening.progress.to(interpolators.toEased("easeInOutCubic")),
							else: 1,
						}),
					})}
				/>
			</VisibilityToggler>
		</S.PhoneFooter>
	);
});

const TemplateCards = memo(() => {
	const isVisible = useUnit(model.$inRange3_7);
	const iteration3OpeningStatus = useUnit(model.$iteration3.opening.$status);

	return (
		<VisibilityToggler isHidden={!isVisible}>
			<S.TemplateCardsWrapper
				style={springUtils.optimizeStyleForRendering({
					opacity: model.iteration4.closing.progress
						.to(interpolators.toEased("easeInOutCubic"))
						.to(interpolators.toInverted),
					y: model.iteration4.closing.progress
						.to(interpolators.toEased("easeInOutCubic"))
						.to(interpolators.toScaledOn(20)),
				})}>
				<S.TemplateCards>
					{TEMPLATES.map((src, index) => {
						const cardProps = calculateTemplateCardProps(index, TEMPLATES.length);

						return (
							<S.TemplateCard
								key={index}
								className='border-radius-overflow-bugfix'
								style={springUtils.optimizeStyleForRendering(
									getTemplateCardStyle({
										iteration: model.iteration3,
										isSwapped: iteration3OpeningStatus,
										cardProps,
									})
								)}>
								<S.TemplateCardImage
									style={springUtils.optimizeStyleForRendering({
										scale: common.variant({
											if: index === cardProps.center,
											then: model.iteration4.opening.progress
												.to(interpolators.toEased("easeInOutCubic"))
												.to(interpolators.toInverted)
												.to(interpolators.toScaledOn(0.4))
												.to((value) => 1 + value),
											else: 1,
										}),
									})}
									src={src}
								/>
							</S.TemplateCard>
						);
					})}
				</S.TemplateCards>
			</S.TemplateCardsWrapper>
		</VisibilityToggler>
	);
});
