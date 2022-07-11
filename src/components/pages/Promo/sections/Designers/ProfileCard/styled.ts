import { a } from "react-spring";
import styled from "styled-components";

import { Image } from "@components/common/ui/Image/styled";

import { mobile } from "@styles/breakpoint";

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

interface ProfileCardSizedProps {
	$size: CardSizeKind;
}

export const Avatar = styled(a.div)`
	width: var(--size);
	height: var(--size);
	flex: 0 0 var(--size);
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

export const Content = styled.div`
	${mobile`
		width: 100%;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
		margin-left: 1.4rem;
	`}
`;

export const Name = styled.p`
	font-weight: 600;
	margin-bottom: -0.3rem;
	white-space: nowrap;
`;

export const Rating = styled.div`
	display: flex;
	margin-top: 0.5rem;
	align-items: center;

	${mobile`
		margin-top: 0;
		flex-direction: row-reverse;
	`}
`;

export const RatingIcon = styled.div`
	fill: black;
	width: var(--size);
	height: var(--size);

	--size: 2rem;

	${mobile`
		--size: 1.6rem;
	`}
`;

export const RatingLabel = styled.p`
	margin-left: 0.5rem;
	font-weight: 600;
	font-size: 2rem;
	margin-bottom: -0.3em;

	${mobile`
	    margin-right: 0.6rem;
		 font-size: 1.6rem;
		 margin-bottom: -0.4em;
	`}
`;

export const ProfileCard = styled.div<ProfileCardSizedProps>`
	padding: ${(props) => getCardSize(props.$size).padding};
	display: flex;
	background: white;
	flex-direction: row;
	align-items: center;
	border-radius: 90rem;
	box-shadow: 5px 10px 20px rgba(0, 0, 0, 0.05);

	${Name} {
		font-size: ${(props) => getCardSize(props.$size).fontSize};
	}

	${Content} {
		margin-left: ${(props) => getCardSize(props.$size).fontSize};
	}

	${Avatar} {
		--size: ${(props) => getCardSize(props.$size).avatarSize};

		${mobile`
			--size: 4rem;
		`}
	}

	${mobile`
		padding: 1rem 2rem 1rem 1rem;
		border-radius: 90rem;
	`}
`;
