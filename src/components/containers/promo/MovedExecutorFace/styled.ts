import { a } from "react-spring";
import styled from "styled-components";

import { Image } from "@components/common/ui/Image/styled";

const EXECUTOR_AVATAR_OUTSIDE_BORDER_SIZE = ".4rem";

export const MovedExecutorFace = styled(a.div)`
	top: 0;
	left: 0;
	position: absolute;
	border-radius: 50%;
	will-change: transform;

	&:after {
		content: "";
		border-radius: 50%;
		width: 100%;
		height: 100%;
		position: absolute;
		left: -${EXECUTOR_AVATAR_OUTSIDE_BORDER_SIZE};
		top: -${EXECUTOR_AVATAR_OUTSIDE_BORDER_SIZE};
		border: ${EXECUTOR_AVATAR_OUTSIDE_BORDER_SIZE} solid white;
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
