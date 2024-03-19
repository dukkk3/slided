import { animated } from "@react-spring/web";
import styled from "styled-components";

import { Image } from "../image";

export const Loader = styled(animated.div)`
	position: relative;
`;

export const PieceGroup = styled(animated.div)`
	display: flex;
	position: relative;
	justify-content: center;
	align-items: flex-end;
	z-index: 0;
`;

export const Piece = styled.div`
	width: calc(6rem * var(--scale));
	height: calc(5rem * var(--scale));
	overflow: hidden;
	border-radius: 0.5rem;
	transform: skewY(12deg);
	position: relative;

	path {
		fill: ${({ theme }) => theme.color.accent.primary};
	}

	--scale: 1;

	&:nth-child(1) {
		--scale: 0.8;
	}

	&:nth-child(2) {
		--scale: 0.9;
	}

	&:not(:nth-last-child(1)) {
		margin-right: -7.5%;
		/* margin-right: -5rem; */
	}
`;

export const PieceContent = styled(animated.div)`
	top: 0;
	left: 0;
	content: "";
	width: 100%;
	height: 100%;
	display: block;
	position: absolute;
	background: ${({ theme }) => theme.color.accent.primary};
	transform-origin: left center;
`;

export const Logo = styled(Image)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	text-align: center;
	position: absolute;
	z-index: 1;

	${Image.S.Image} {
		width: 85%;
	}
`;
