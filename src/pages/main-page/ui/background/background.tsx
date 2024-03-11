import { useGate } from "effector-react";
import { animated } from "@react-spring/web";

import { math } from "@shared/utils";

import * as S from "./background.styled";
import * as model from "./background.model";

export const Background = () => {
	useGate(model.Gate);
	return (
		<animated.div
			style={{ opacity: model.parentModel.smoothedDistanceOfBiggestStep.to(math.invert) }}>
			<S.Canvas />
		</animated.div>
	);
};
