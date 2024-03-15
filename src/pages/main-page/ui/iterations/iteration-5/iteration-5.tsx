import { useUnit } from "effector-react";
import { memo } from "react";

import { interpolators } from "@shared/helpers";
import { VisibilityToggler } from "@shared/ui";
import { common } from "@shared/utils";

import { USERS, FOCUSED_USER_INDEX } from "./iteration-5.config";
import * as model from "./iteration-5.model";
import * as S from "./iteration-5.styled";

export const Iteration5 = memo(() => {
	const isSectionVisible = useUnit(model.$iteration5Status);
	const iteration5OpeningStatus = useUnit(model.$iteration5.opening.$inFlight);

	return (
		<VisibilityToggler isHidden={!isSectionVisible}>
			<S.Designers>
				{/* <S.ProfileCardGroup
					style={{
						top: `${normalize(TARGET_USER.position.y) * 100}%`,
						left: `${normalize(TARGET_USER.position.x) * 100}%`,
						transform: `translate3d(-50%, -50%, 0)`,
					}}>
					<ProfileCard {...TARGET_USER.data} avatarRef={faceContainerRef} />
				</S.ProfileCardGroup> */}
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
									.to(interpolators.toRanged(inQueueIndex / USERS.length, (inQueueIndex + 1) / USERS.length))
									.to(interpolators.toEased("easeInOutCubic")),
								else: model.iteration5.closing.progress
									.to(interpolators.toInverted)
									.to(interpolators.toEased("easeInOutCubic")),
							}),
						}}
						openingProgress={common.variant({
							if: index === FOCUSED_USER_INDEX,
							then: model.iteration5.closing.progress
								.to(interpolators.toStepped(0.001))
								.to(interpolators.toEased("easeInOutQuart"))
								.to(interpolators.toInverted),
						})}
					/>
				))}
			</S.Designers>
		</VisibilityToggler>
	);
});