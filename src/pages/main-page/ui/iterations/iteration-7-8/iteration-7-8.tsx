import { useUnit } from "effector-react";

import { interpolators, springUtils } from "@shared/helpers";
import { VisibilityToggler } from "@shared/ui";
import { common } from "@shared/utils";

import { IterationContainer } from "../../iteration-container";

import { ZOOM, PERSPECTIVE, CAR_TEMPLATE_SOURCE } from "./iteration-7-8.config";
import * as model from "./iteration-7-8.model";
import * as S from "./iteration-7-8.styled";

export const Iteration7_8 = () => {
	const isVisible = useUnit(model.$inRange7_8);
	const iteration8OpeningStatus = useUnit(model.$iteration8.opening.$inFlight);
	const [presentationRef] = model.usePresentationRect("initial");

	return (
		<VisibilityToggler isHidden={!isVisible}>
			<IterationContainer>
				<VisibilityToggler isHidden>
					<S.PresentationWrapper ref={presentationRef} />
				</VisibilityToggler>
				<S.PresentationWrapper style={{ perspective: PERSPECTIVE }}>
					<S.Presentation
						className='border-radius-overflow-bugfix'
						style={springUtils.optimizeStyleForRendering({
							opacity: common.variant({
								if: iteration8OpeningStatus,
								then: model.iteration8.opening.progress
									.to(interpolators.toStepped(1))
									.to(interpolators.toEased("easeInOutCubic"))
									.to(interpolators.toInverted),
								else: model.iteration7.opening.progress
									.to(interpolators.toRanged(0, 0.5))
									.to(interpolators.toEased("easeInOutCubic")),
							}),
							z: model.iteration7.opening.progress
								.to(interpolators.toEased("easeInOutCubic"))
								.to(interpolators.toInverted)
								.to(interpolators.toScaledOn(PERSPECTIVE * 0.4)),
							background: `url(${CAR_TEMPLATE_SOURCE}) center center / cover`,
							transformOrigin: "left top",
						})}>
						<S.PresentationCanvasWrapper
							$zoom={ZOOM}
							style={springUtils.optimizeStyleForRendering({
								scale: model.iteration7.opening.progress
									.to(interpolators.toEased("easeInOutCubic"))
									.to((value) => 1 + (1 / ZOOM - 1) * value),
								opacity: model.iteration7.closing.progress
									.to(interpolators.toStepped(0.999))
									.to(interpolators.toEased("easeInOutCubic"))
									.to(interpolators.toInverted),
							})}>
							<S.PresentationCanvas />
						</S.PresentationCanvasWrapper>
					</S.Presentation>
				</S.PresentationWrapper>
			</IterationContainer>
		</VisibilityToggler>
	);
};
