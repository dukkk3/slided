import React, { memo } from "react";

import * as S from "./styled";

export interface Props extends React.PropsWithChildren<React.ComponentProps<"button">> {
	size?: S.SizeKind;
	theme?: S.ThemeKind;
}

export const Button: React.FC<Props> = memo(
	({ children, size = "s", theme = "primary", ...rest }) => {
		return (
			<S.Button {...(rest as any)} $theme={theme} $size={size}>
				{children}
			</S.Button>
		);
	}
);
