import styled from "styled-components";

import { Image } from "@components/common/ui/Image/styled";

const AVATAR_BORDER_SIZE = ".4rem";

export const UserCursor = styled.div`
	width: 2.2rem;
	height: 2.2rem;
	position: relative;
`;

export const CursorWrapper = styled.div`
	width: 100%;
	height: 100%;
`;

export const Avatar = styled.div`
	top: calc(100% + 0.2rem);
	left: calc(100% + 0.2rem);
	width: 6rem;
	height: 6rem;
	position: absolute;

	${Image} {
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: 50%;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	&:after {
		content: "";
		border-radius: 50%;
		width: 100%;
		height: 100%;
		position: absolute;
		left: -${AVATAR_BORDER_SIZE};
		top: -${AVATAR_BORDER_SIZE};
		border: ${AVATAR_BORDER_SIZE} solid white;
	}
`;
