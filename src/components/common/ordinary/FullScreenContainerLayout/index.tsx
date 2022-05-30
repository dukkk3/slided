import React, { memo } from "react";

import * as S from "./styled";

export interface Props extends React.PropsWithChildren<React.ComponentProps<"div">> {}

export const FullScreenContainerLayout: React.FC<Props> = memo(({ children, ...rest }) => {
	return (
		<S.FullScreenContainerLayout {...(rest as any)}>
			<S.Content>{children}</S.Content>
		</S.FullScreenContainerLayout>
	);
});
