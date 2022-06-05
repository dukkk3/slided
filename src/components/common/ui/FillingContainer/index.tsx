import React, { forwardRef } from "react";

import * as S from "./styled";

export interface Props extends React.PropsWithChildren<React.ComponentProps<"div">> {}

export const FillingContainer = forwardRef<HTMLDivElement, Props>(({ children, ...rest }, ref) => {
	return (
		<S.FillingContainer {...(rest as any)} ref={ref}>
			<S.Content>{children}</S.Content>
		</S.FillingContainer>
	);
});
