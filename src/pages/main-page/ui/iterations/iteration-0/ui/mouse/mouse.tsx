import { memo } from "react";

import * as S from "./mouse.styled";

export interface MouseProps extends React.ComponentProps<"div"> {}

export const Mouse = memo((props: MouseProps) => {
	return <S.Mouse {...props} />;
});
