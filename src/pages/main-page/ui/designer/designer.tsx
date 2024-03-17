import { useUnit } from "effector-react";
import { memo } from "react";

import { springUtils } from "@shared/helpers";
import { VisibilityToggler } from "@shared/ui";

import { DESIGNER_AVATAR } from "./designer.config";
import * as model from "./designer.model";
import * as S from "./designer.styled";

export const Designer = memo(() => {
	const style = model.designerShapeInterpolator.useStyle();
	const isVisible = useUnit(model.$inRange5_8);

	return (
		<VisibilityToggler isHidden={!isVisible}>
			<S.Designer style={springUtils.optimizeStyleForRendering(style)} src={DESIGNER_AVATAR} />
		</VisibilityToggler>
	);
});
