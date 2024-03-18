import { animated } from "@react-spring/web";
import styled from "styled-components";

import { PresentationCanvas } from "./presentation.model";

export const Presentation = styled(animated(PresentationCanvas))`
	top: 0;
	left: 0;
	z-index: 10;
	overflow: hidden;
	position: absolute;
	border-radius: 50px;
`;
