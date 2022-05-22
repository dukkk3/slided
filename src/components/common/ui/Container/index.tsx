import React, { forwardRef } from "react";

import * as S from "./styled";

export interface Props extends React.PropsWithChildren<React.ComponentProps<"div">> {}

export const Container = forwardRef<HTMLDivElement, Props>(({ children, ...rest }, ref) => {
	return (
		<S.Container ref={ref as any} {...rest}>
			{children}
		</S.Container>
	);
});
