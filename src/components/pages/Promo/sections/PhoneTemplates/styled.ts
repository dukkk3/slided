import { a } from "react-spring";
import styled from "styled-components";

import { Image } from "@components/common/ui/Image/styled";
import { Button } from "@components/common/ui/Button/styled";

import { Phone } from "../../shared/Phone/styled";

export { Description, DescriptionGroup } from "../../shared/Phone/styled";

export const PhoneGroup = styled(a.div)`
	${Phone} {
		height: min(70rem, 100%);
	}
`;

export const ButtonWrapper = styled(a.div)`
	position: absolute;
	height: var(--height);
	left: var(--phone-padding);
	bottom: var(--phone-padding);
	width: calc(100% - var(--phone-padding) * 2);
	will-change: transform, opacity;

	--height: 6rem;

	${Button} {
		width: 100%;
		height: 100%;
		border-radius: 90rem;
	}

	> * {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		cursor: default;
		border-radius: 90rem;
		position: absolute;
	}
`;

export const CardsWrapper = styled.div`
	margin-top: 2rem;
`;

export const ReadyTemplatesCards = styled.div`
	position: relative;
	margin-top: -0.75rem;
`;

interface CardWrapperProps {
	$overlay?: boolean;
}

export const CardWrapper = styled.div<CardWrapperProps>`
	top: 0;
	left: 0;
	width: 100%;
	padding: 0.5rem 0;
	position: ${(props) => (props.$overlay ? "absolute" : "relative")};
`;

export const Card = styled(a.div)`
	width: 100%;
	overflow: hidden;
	position: relative;
	border-radius: 1rem;
	padding-bottom: 52.25%;
	transform-origin: center top;
	will-change: transform, opacity;
`;

export const OverlayCardContent = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: absolute;
`;

export const OverlayCardImage = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: absolute;
	will-change: height;
`;

export const Scan = styled(a.div)`
	top: 0;
	left: 0;
	position: absolute;
	height: 0.3rem;
	background: ${(props) => props.theme.color.primary};
	width: 100%;
	z-index: 9;
	will-change: transform;

	&:after {
		left: 0;
		top: -50%;
		content: "";
		width: 100%;
		height: 200%;
		position: absolute;
		background: ${(props) => props.theme.color.primary};
		filter: blur(1rem);
	}
`;

export const CardImage = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;

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
