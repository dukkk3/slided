import { useUnit } from "effector-react";

import { springUtils } from "@shared/helpers";
import { VisibilityToggler } from "@shared/ui";

import * as model from "./presentation.model";
import * as S from "./presentation.styled";

export const Presentation = () => {
	const presentationStyle = model.presentationShapeInterpolator.useStyle();
	const isVisible = useUnit(model.$inRange8_9);

	return (
		<VisibilityToggler isHidden={!isVisible}>
			<S.Presentation style={springUtils.optimizeStyleForRendering(presentationStyle)} />
		</VisibilityToggler>
	);
};
