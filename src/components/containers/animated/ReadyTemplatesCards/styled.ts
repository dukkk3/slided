import { a } from "react-spring";
import styled from "styled-components";

import { Image } from "@components/common/ui/Image/styled";

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
	padding: 0.75rem 0;
	position: ${(props) => (props.$overlay ? "absolute" : "relative")};
`;

export const Card = styled(a.div)`
	width: 100%;
	overflow: hidden;
	position: relative;
	border-radius: 2rem;
	padding-bottom: 52.25%;
`;

export const OverlayCardImage = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: absolute;
`;

export const Scan = styled(a.div)`
	top: 0;
	left: 0;
	position: absolute;
	height: 0.3rem;
	background: ${(props) => props.theme.color.primary};
	width: 100%;
	z-index: 9;

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
			object-position: center 20%;
		}
	}
`;