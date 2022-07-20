import { memo } from "react";

import { getVectorImageByName } from "@assets/images";

import * as S from "./styled";

export const ArrowsIcon: React.FC = memo(() => {
	return (
		<S.ArrowsIcon>
			<S.IconGroup>{getVectorImageByName("icons", "ArrowLeft")}</S.IconGroup>
			<S.IconGroup>{getVectorImageByName("icons", "ArrowLeft")}</S.IconGroup>
		</S.ArrowsIcon>
	);
});
