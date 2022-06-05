import { memo } from "react";

import { Image } from "@components/common/ui/Image";

import { getVectorImageByName } from "@assets/images";

import * as S from "./styled";

export interface Props {
	avatarSource?: string;
}

export const UserCursor: React.FC<Props> = memo(({ avatarSource }) => {
	return (
		<S.UserCursor>
			<S.CursorWrapper>{getVectorImageByName("common", "Cursor")}</S.CursorWrapper>
			<S.Avatar>
				<Image src={avatarSource} />
			</S.Avatar>
		</S.UserCursor>
	);
});
