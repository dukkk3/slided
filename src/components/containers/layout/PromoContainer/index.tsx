import React, { memo } from "react";

import * as S from "./styled";

export interface Props extends React.PropsWithChildren<React.ComponentProps<"div">> {}

export const PromoContainer: React.FC<Props> = memo(({ children, ...rest }) => {
	return (
		<S.PromoContainer {...(rest as any)}>
			<S.Container>{children}</S.Container>
		</S.PromoContainer>
	);
});
