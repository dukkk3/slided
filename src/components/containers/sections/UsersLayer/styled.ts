import { Image } from "@components/common/ui/Image/styled";
import { a } from "react-spring";
import styled from "styled-components";

export const UsersLayer = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
`;

export const UserCardGroup = styled.div`
	top: 0;
	left: 0;
	position: absolute;
	transform-origin: center;
`;

export const UserCardWrapper = styled(a.div)`
	transform-origin: center;
`;

const EXECUTOR_AVATAR_OUTSIDE_BORDER_SIZE = ".4rem";

export const ExecutorAvatarWrapper = styled(a.div)`
	position: absolute;
	z-index: 2;

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
`;

export const ExecutorAvatar = styled.div`
	width: 100%;
	height: 100%;
	border-radius: 50%;
	overflow: hidden;

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
