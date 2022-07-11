import React, { forwardRef } from "react";

import * as S from "./styled";

export interface Props extends React.PropsWithChildren<React.ComponentProps<"div">> {}

export const PromoContainer = forwardRef<HTMLDivElement, Props>(({ children, ...rest }, ref) => {
	return (
		<S.PromoContainer ref={ref} {...(rest as any)}>
			<S.Container>{children}</S.Container>
		</S.PromoContainer>
	);
});
