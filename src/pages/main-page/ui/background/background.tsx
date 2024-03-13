import { useGate } from "effector-react";

import * as model from "./background.model";
import * as S from "./background.styled";

export const Background = () => {
	useGate(model.Gate);
	return <S.Canvas />;
};
