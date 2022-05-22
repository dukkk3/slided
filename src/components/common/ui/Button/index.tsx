import React, { memo } from "react";

import * as S from "./styled";

export interface Props extends React.PropsWithChildren<React.ComponentProps<"button">> {
	size?: S.SizeKind;
}

export const Button: React.FC<Props> = memo(({ children, size = "s", ...rest }) => {
	return (
		<S.Button {...(rest as any)} $size={size}>
			{children}
		</S.Button>
	);
});
