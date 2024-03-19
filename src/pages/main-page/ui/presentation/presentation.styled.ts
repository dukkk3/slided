import { animated } from "@react-spring/web";
import styled from "styled-components";

import { Image } from "@shared/ui";

export const Presentation = styled(animated(Image))`
	top: 0;
	left: 0;
	z-index: 10;
	overflow: hidden;
	position: absolute;
	border-radius: 10px;

	${Image.S.Image} {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;
