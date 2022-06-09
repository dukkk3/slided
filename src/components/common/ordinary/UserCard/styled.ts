import { a } from "react-spring";
import styled from "styled-components";

import { Image } from "@components/common/ui/Image/styled";

function generateCardSize() {
	return {
		s: {
			padding: "1.5rem 1.7rem 1.5rem 1.5rem",
			fontSize: "1.5rem",
			avatarSize: "3.5rem",
		},
		m: {
			padding: "2rem 5rem 2rem 2rem",
			fontSize: "2rem",
			avatarSize: "8rem",
		},
	};
}

function getCardSize(sizeKey: CardSizeKind) {
	return generateCardSize()[sizeKey];
}

export type CardSizeKind = keyof ReturnType<typeof generateCardSize>;

interface UserCardSizedProps {
	$size: CardSizeKind;
}

export const UserCard = styled.div<UserCardSizedProps>`
	padding: ${(props) => getCardSize(props.$size).padding};
	display: flex;
	background: white;
	flex-direction: row;
	align-items: center;
	border-radius: 90rem;
	box-shadow: 5px 10px 20px rgba(0, 0, 0, 0.05);
`;

export const Avatar = styled(a.div)<UserCardSizedProps>`
	width: ${(props) => getCardSize(props.$size).avatarSize};
	height: ${(props) => getCardSize(props.$size).avatarSize};
	flex: 0 0 ${(props) => getCardSize(props.$size).avatarSize};
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

export const Content = styled.div<UserCardSizedProps>`
	margin-left: ${(props) => getCardSize(props.$size).fontSize};
`;

export const Name = styled.p<UserCardSizedProps>`
	font-weight: 600;
	margin-bottom: -0.3rem;
	white-space: nowrap;
	font-size: ${(props) => getCardSize(props.$size).fontSize};
`;

export const Rating = styled.div`
	display: flex;
	margin-top: 0.5rem;
	align-items: center;
`;

export const RatingIcon = styled.div`
	fill: black;
	width: 2rem;
	height: 2rem;
`;

export const RatingLabel = styled.p`
	margin-left: 0.5rem;
	font-weight: 600;
	font-size: 2rem;
	margin-bottom: -0.3em;
`;
