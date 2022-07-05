import { memo, useMemo } from "react";
import { Interpolation } from "react-spring";

import { Icon } from "@components/common/ui/Icon";
import { Image } from "@components/common/ui/Image";

import { clamp } from "@core/utils/math.utils";

import * as S from "./styled";

export interface Props extends React.ComponentProps<"div"> {
	name: string;
	rating?: number;
	size?: S.CardSizeKind;
	avatarRef?: React.ForwardedRef<any>;
	avatarSource: string;
	avatarVisibleInterpolation?: Interpolation<any, number>;
}

export const UserCard: React.FC<Props> = memo(
	({
		children,
		avatarSource,
		name,
		rating,
		avatarRef,
		avatarVisibleInterpolation,
		size = "m",
		...rest
	}) => {
		const preparedRating = useMemo(() => (rating ? clamp(rating, 0, 5) : 0), [rating]);

		return (
			<S.UserCard $size={size} {...(rest as any)}>
				<S.Avatar ref={avatarRef} $size={size} style={{ opacity: avatarVisibleInterpolation }}>
					<Image src={avatarSource} lazy={false} />
				</S.Avatar>
				<S.Content $size={size}>
					<S.Name $size={size}>{name}</S.Name>
					{rating && (
						<S.Rating>
							<S.RatingIcon>
								<Icon name='Star' />
							</S.RatingIcon>
							<S.RatingLabel>{preparedRating.toFixed(1).replace(".", ",")}</S.RatingLabel>
						</S.Rating>
					)}
				</S.Content>
			</S.UserCard>
		);
	}
);
