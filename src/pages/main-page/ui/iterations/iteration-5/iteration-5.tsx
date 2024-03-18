import { useUnit } from "effector-react";
import { memo } from "react";

import { interpolators } from "@shared/helpers";
import { VisibilityToggler } from "@shared/ui";
import { common, math } from "@shared/utils";

import { IterationContainer } from "../../iteration-container";

import { USERS, FOCUSED_USER_INDEX } from "./iteration-5.config";
import { normalize } from "./iteration-5.lib";
import * as model from "./iteration-5.model";
import * as S from "./iteration-5.styled";

export const Iteration5 = memo(() => {
	const isSectionVisible = useUnit(model.$iteration5Status);
	const iteration5OpeningStatus = useUnit(model.$iteration5.opening.$inFlight);
	const [designerRef] = model.useDesignerRect("initial");

	return (
		<VisibilityToggler isHidden={!isSectionVisible}>
			<IterationContainer>
				<S.Designers>
					<VisibilityToggler isHidden>
						<S.User
							{...USERS[FOCUSED_USER_INDEX].props}
							avatarRef={designerRef}
							style={{
								top: `${normalize(USERS[FOCUSED_USER_INDEX].position.y) * 100}%`,
								left: `${normalize(USERS[FOCUSED_USER_INDEX].position.x) * 100}%`,
								transform: `translate3d(-50%, -50%, 0)`,
							}}
						/>
					</VisibilityToggler>
					{USERS.map(({ position, props, inQueueIndex }, index) => (
						<S.User
							key={index}
							{...props}
							style={{
								top: `${(position.y / 2 + 0.5) * 100}%`,
								left: `${(position.x / 2 + 0.5) * 100}%`,
								transform: `translate3d(-50%, -50%, 0)`,
								opacity: common.variant({
									if: iteration5OpeningStatus,
									then: model.iteration5.opening.progress
										.to(interpolators.toRanged(0, 0.5))
										.to(interpolators.toEased("easeInOutCubic")),
									else: model.iteration5.closing.progress
										.to(interpolators.toRanged(0, 0.5))
										.to(interpolators.toEased("easeInOutCubic"))
										.to(interpolators.toInverted),
								}),
								scale: common.variant({
									if: iteration5OpeningStatus,
									then: model.iteration5.opening.progress
										.to(
											interpolators.toRanged(inQueueIndex / USERS.length, (inQueueIndex + 1) / USERS.length)
										)
										.to(interpolators.toEased("easeInOutCubic")),
									else: model.iteration5.closing.progress
										.to(interpolators.toInverted)
										.to(interpolators.toEased("easeInOutCubic")),
								}),
							}}
							openingProgress={common.variant({
								if: index === FOCUSED_USER_INDEX,
								then: model.iteration5.closing.progress
									.to(interpolators.toStepped(math.EPSILON))
									.to(interpolators.toEased("easeInOutQuart"))
									.to(interpolators.toInverted),
							})}
						/>
					))}
				</S.Designers>
			</IterationContainer>
		</VisibilityToggler>
	);
});
