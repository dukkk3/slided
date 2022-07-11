import { a } from "react-spring";
import styled from "styled-components";

import { Image } from "@components/common/ui/Image/styled";

import { generateOutsideBorderMixin } from "@styles/mixins";

export const MovedDesignerFace = styled(a.div)`
	top: 0;
	left: 0;
	position: absolute;
	border-radius: 50%;
	will-change: transform;

	&:after {
		content: "";
		box-sizing: border-box;
		${generateOutsideBorderMixin(".4rem")}
	}

	${Image} {
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: inherit;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
`;
