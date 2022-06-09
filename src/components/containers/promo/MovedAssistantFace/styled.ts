import { a } from "react-spring";
import styled from "styled-components";

import { generateOutsideBorderMixin } from "@styles/mixins";

export const MovedAssistantFace = styled(a.div)`
	top: 0;
	left: 0;
	position: absolute;
	will-change: transform;
`;

export const OverlayBorderGroup = styled(a.div)`
	pointer-events: none;
	position: absolute;
`;

export const Border = styled.div`
	${generateOutsideBorderMixin(".5rem")}
`;
