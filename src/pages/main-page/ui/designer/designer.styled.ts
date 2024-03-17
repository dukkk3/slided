import { animated } from "@react-spring/web";
import styled from "styled-components";

import { styledMixin } from "@shared/styled";
import { Image } from "@shared/ui";

export const Designer = styled(animated(Image))`
	top: 0;
	left: 0;
	position: absolute;
	border-radius: 50%;

	&:after {
		content: "";
		box-sizing: border-box;
		${styledMixin.generateOutsideBorderMixin("4px")}
	}

	${Image.S.Image} {
		width: 100%;
		height: 100%;
		overflow: hidden;
		object-fit: cover;
		border-radius: inherit;
	}
`;
