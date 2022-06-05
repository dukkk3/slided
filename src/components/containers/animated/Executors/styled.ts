import { a } from "react-spring";
import styled from "styled-components";

import { Image } from "@components/common/ui/Image/styled";

export const Executors = styled.div`
	width: 100%;
	height: 100%;
	visibility: hidden;

	> * {
		visibility: visible;
	}
`;

export const UserCardGroup = styled.div`
	top: 0;
	left: 0;
	position: absolute;
	transform-origin: center;
`;

export const UserCardWrapper = styled(a.div)`
	transform-origin: center;
	will-change: transform;
`;

const EXECUTOR_AVATAR_OUTSIDE_BORDER_SIZE = ".4rem";

export const ExecutorAvatarWrapper = styled.div`
	position: absolute;
	z-index: 2;
`;

export const ExecutorAvatar = styled(a.div)`
	width: 100%;
	height: 100%;
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
