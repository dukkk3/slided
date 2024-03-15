import { forwardRef } from "react";

import type { LikeSpringValue } from "@shared/types";
import { AssignComponentProps } from "@shared/ui";
import { math } from "@shared/utils";

import * as S from "./user.styled";

export interface UserProps extends React.ComponentProps<"div"> {
	name: string;
	rating?: number;
	avatarSrc?: string;
	size?: S.Size;
	openingProgress?: LikeSpringValue<number>;
}

export const User = AssignComponentProps(
	forwardRef<HTMLDivElement, UserProps>(
		({ name, children, avatarSrc, openingProgress, rating = 4, size = "m", ...rest }, ref) => {
			rating = math.clamp(rating, 0, 5);

			return (
				<S.User {...rest} $size={size} ref={ref}>
					<S.Avatar src={avatarSrc} style={{ opacity: openingProgress }} />
					<S.Content>
						<S.Name>{name}</S.Name>
						{rating && (
							<S.Rating>
								{/* <S.RatingIcon><Icon name='Star' /></S.RatingIcon> */}
								<S.RatingLabel>{rating.toFixed(1).replace(".", ",")}</S.RatingLabel>
							</S.Rating>
						)}
					</S.Content>
				</S.User>
			);
		}
	),
	{ S }
);
