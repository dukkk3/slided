import { a } from "react-spring";
import styled from "styled-components";

import { Image } from "@components/common/ui/Image/styled";

export const MovedGridTemplate = styled(a.div)`
	top: 0;
	left: 0;
	z-index: 9;
	position: absolute;
	overflow: hidden;
	border-radius: 1rem;
	will-change: transform;

	${Image} {
		width: 100%;
		height: 100%;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
`;
