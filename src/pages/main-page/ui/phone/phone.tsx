import { memo } from "react";

import { interpolators, springUtils } from "@shared/helpers";
import type { LikeSpringValue } from "@shared/types";
import { AssignComponentProps } from "@shared/ui";

import * as S from "./phone.styled";

export interface PhoneProps extends React.ComponentProps<"div"> {
	children?: React.ReactNode;
	alternative?: boolean;
	hiddenContent?: boolean;
	openingProgress: LikeSpringValue<number>;
}

export const Phone = AssignComponentProps(
	memo(({ children, alternative, openingProgress, hiddenContent = false, ...rest }: PhoneProps) => {
		return (
			<S.Phone {...rest} $alternative={alternative} $hidden={hiddenContent}>
				<S.Background
					className='safari-border-radius-overflow-bugfix'
					style={springUtils.optimizeStyleForRendering({
						y: openingProgress
							.to(interpolators.toInverted)
							.to(interpolators.toScaledOn(-50))
							.to(interpolators.toPercents),
						opacity: openingProgress,
					})}
				/>
				<S.ContentWrapper>
					<S.Content>{children}</S.Content>
				</S.ContentWrapper>
			</S.Phone>
		);
	}),
	{ S }
);
