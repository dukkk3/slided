import { memo } from "react";

import * as S from "./styled";

export interface Props extends Omit<React.ComponentProps<"div">, "ref" | "children"> {}

export const MouseIcon: React.FC<Props> = memo((props) => {
	return <S.MouseIcon {...props} />;
});
