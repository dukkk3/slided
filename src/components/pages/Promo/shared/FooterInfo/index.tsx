import React, { memo } from "react";

import * as S from "./styled";

export const FooterInfo: React.FC = memo(() => {
	return (
		<S.FooterInfo>
			<S.ItemGroup>
				<S.ItemWrapper>
					<S.Item $asLink>info@slided.io</S.Item>
				</S.ItemWrapper>
				<S.ItemWrapper>
					<S.Item $asLink>press@slided.io</S.Item>
				</S.ItemWrapper>
			</S.ItemGroup>
			<S.ItemGroup>
				<S.ItemWrapper>
					<S.Item>© 2022 All Right Reserved</S.Item>
				</S.ItemWrapper>
			</S.ItemGroup>
		</S.FooterInfo>
	);
});
