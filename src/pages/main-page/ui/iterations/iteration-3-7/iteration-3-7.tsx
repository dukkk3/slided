import { useUnit } from "effector-react";
import { memo } from "react";

import { interpolations, springUtils } from "@shared/helpers";
import { VisibilityToggler } from "@shared/ui";
import { common } from "@shared/utils";

import * as assets from "./assets";
import { TEMPLATES } from "./iteration-3-7.config";
import { calculateTemplateCardProps, getTemplateCardStyle } from "./iteration-3-7.lib";
import * as model from "./iteration-3-7.model";
import * as S from "./iteration-3-7.styled";

export const Iteration3_7 = () => {
	const isSectionVisible = useUnit(model.$inRange3_7);

	return (
		<VisibilityToggler isHidden={!isSectionVisible}>
			<S.PhoneWrapper
				style={springUtils.optimizeStyleForRendering({
					opacity: model.iteration7.opening.progress
						.to(interpolations.toStepped(0.45))
						.to(interpolations.toEased("easeInOutCubic"))
						.to(interpolations.toInverted),
				})}>
				<S.Phone
					openingProgress={model.iteration3.opening.progress.to(
						interpolations.toEased("easeInOutCubic")
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
		</VisibilityToggler>
	);
};

const Description = memo(() => {
	const iteration3Status = useUnit(model.$iteration3Status);
	const iteration5OpeningStatus = useUnit(model.$iteration5.opening.$status);
	const iteration6OpeningStatus = useUnit(model.$iteration6.opening.$status);

	return (
		<S.Descriptions>
			<S.Description
				words={["Choose a style", "from ready-made", "templates"]}
				openingProgress={model.iteration3.opening.progress.to(interpolations.toEased("easeInOutCubic"))}
				closingProgress={model.iteration4.closing.progress.to(interpolations.toEased("easeInOutCubic"))}
				isOpening={iteration3Status}
			/>
			<S.Description
				words={["Our selected", "designers are on", "the mission to get", "your task done"]}
				openingProgress={model.iteration5.opening.progress
					.to(interpolations.toClampedScaled(model.iteration5.opening.durationFactor))
					.to(interpolations.toEased("easeInOutCubic"))}
				closingProgress={model.iteration5.closing.progress
					.to(interpolations.toClampedScaled(model.iteration5.closing.durationFactor))
					.to(interpolations.toEased("easeInOutCubic"))}
				isOpening={iteration5OpeningStatus}
				$withAbsolutePosition
			/>
			<S.BoldDescription
				words={["Designer is set", "& ready to start"]}
				openingProgress={model.iteration6.opening.progress.to(interpolations.toEased("easeInOutCubic"))}
				closingProgress={model.iteration6.closing.progress.to(() => 0)}
				isOpening={iteration6OpeningStatus}
				$withAbsolutePosition
			/>
		</S.Descriptions>
	);
});

const Face = memo(() => {
	const [inPhoneRef] = model.useAssistantShapeRect("in-phone");

	return (
		<S.Face>
			<S.FaceContainer ref={inPhoneRef} />
			<S.FaceContainer style={{ transform: "translateX(-40%)" }} />
			<S.FaceContainer style={{ transform: "translateX(40%)" }} />
		</S.Face>
	);
});

const Ray = memo(() => {
	return (
		<S.RayImage
			style={springUtils.optimizeStyleForRendering({
				opacity: model.iteration6.opening.progress.to(interpolations.toEased("easeInOutCubic")),
			})}
			src={assets.ray}
		/>
	);
});

const PhoneFooter = memo(() => {
	const iteration3Status = useUnit(model.$iteration3Status);
	const iteration4ClosingStatus = useUnit(model.$iteration4.closing.$status);
	const iteration6ClosingStarted = useUnit(model.$iteration6.closing.$started);

	return (
		<S.PhoneFooter>
			<S.Button
				style={springUtils.optimizeStyleForRendering({
					opacity: common.variant({
						if: iteration3Status,
						then: model.iteration3.closing.progress.to(interpolations.toEased("easeInOutCubic")),
						else: model.iteration4.closing.progress
							.to(interpolations.toRanged(0, 0.5))
							.to(interpolations.toEased("easeInOutCubic"))
							.to(interpolations.toInverted),
					}),
				})}>
				Choose
			</S.Button>
			<S.Button
				variant='grey'
				disabled
				style={springUtils.optimizeStyleForRendering({
					opacity: common.variant({
						if: iteration4ClosingStatus,
						then: model.iteration4.closing.progress
							.to(interpolations.toRanged(0, 0.5))
							.to(interpolations.toEased("easeInOutCubic")),
						else: model.iteration4.closing.progress
							.to(interpolations.toEased("easeInOutCubic"))
							.to(interpolations.toInverted),
					}),
				})}>
				Searching the best...
			</S.Button>
			<S.Slider
				isSwipeEnabled={!iteration6ClosingStarted}
				onSwipeEnd={() => console.log("Swiped ended")}
				style={springUtils.optimizeStyleForRendering({
					opacity: common.variant({
						if: iteration6ClosingStarted,
						then: model.iteration6.opening.progress.to(interpolations.toEased("easeInOutCubic")),
						else: 1,
					}),
				})}
			/>
		</S.PhoneFooter>
	);
});

const TemplateCards = memo(() => {
	const iteration3OpeningStatus = useUnit(model.$iteration3.opening.$status);

	return (
		<S.TemplateCardsWrapper
			style={springUtils.optimizeStyleForRendering({
				opacity: model.iteration4.closing.progress
					.to(interpolations.toEased("easeInOutCubic"))
					.to(interpolations.toInverted),
				y: model.iteration4.closing.progress
					.to(interpolations.toEased("easeInOutCubic"))
					.to(interpolations.toScaled(20)),
			})}>
			<S.TemplateCards>
				{TEMPLATES.map((src, index) => {
					const cardProps = calculateTemplateCardProps(index, TEMPLATES.length);

					return (
						<S.TemplateCard
							key={index}
							style={springUtils.optimizeStyleForRendering(
								getTemplateCardStyle({
									iteration: model.iteration3,
									isSwapped: iteration3OpeningStatus,
									cardProps,
								})
							)}>
							<S.TemplateCardImageWrapper
								style={springUtils.optimizeStyleForRendering({
									scale: common.variant({
										if: index === cardProps.center,
										then: model.iteration4.opening.progress.to(interpolations.toEased("easeInOutCubic")),
										else: 1,
									}),
								})}>
								<S.TemplateCardImage src={src} />
							</S.TemplateCardImageWrapper>
						</S.TemplateCard>
					);
				})}
			</S.TemplateCards>
		</S.TemplateCardsWrapper>
	);
});
