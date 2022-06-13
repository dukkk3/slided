import { a } from "react-spring";
import styled from "styled-components";

import { Image } from "@components/common/ui/Image/styled";

import { breakpoint } from "@styles/breakpoint";

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

	${breakpoint("mobile", "tablet")`
		padding: 1rem 2rem 1rem 1rem;
		border-radius: 90rem;
	`}
`;

export const Avatar = styled(a.div)<UserCardSizedProps>`
	width: var(--size);
	height: var(--size);
	flex: 0 0 var(--size);
	border-radius: 50%;
	overflow: hidden;

	--size: ${(props) => getCardSize(props.$size).avatarSize};

	${Image} {
		width: 100%;
		height: 100%;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	${breakpoint("mobile", "tablet")`
		--size: 4rem;
	`}
`;

export const Content = styled.div<UserCardSizedProps>`
	margin-left: ${(props) => getCardSize(props.$size).fontSize};

	${breakpoint("mobile", "tablet")`
		width: 100%;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
		margin-left: 1.4rem;
	`}
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

	${breakpoint("mobile", "tablet")`
		margin-top: 0;
		flex-direction: row-reverse;
	`}
`;

export const RatingIcon = styled.div`
	fill: black;
	width: var(--size);
	height: var(--size);

	--size: 2rem;

	${breakpoint("mobile", "tablet")`
		--size: 1.6rem;
	`}
`;

export const RatingLabel = styled.p`
	margin-left: 0.5rem;
	font-weight: 600;
	font-size: 2rem;
	margin-bottom: -0.3em;

	${breakpoint("mobile", "tablet")`
	    margin-right: 0.6rem;
		 font-size: 1.6rem;
		 margin-bottom: -0.4em;
	`}
`;
