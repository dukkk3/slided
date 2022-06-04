import React, { memo } from "react";

import * as S from "./styled";

export interface Props extends React.PropsWithChildren<React.ComponentProps<"div">> {}

export const FillingContainer: React.FC<Props> = memo(({ children, ...rest }) => {
	return (
		<S.FillingContainer {...(rest as any)}>
			<S.Content>{children}</S.Content>
		</S.FillingContainer>
	);
});
