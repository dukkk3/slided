import { a } from "react-spring";
import styled from "styled-components";

export const Loader = styled(a.div)`
	position: relative;
`;

export const PieceGroup = styled(a.div)`
	display: flex;
	position: relative;
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
		fill: ${(props) => props.theme.color.primary};
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

export const PieceContent = styled(a.div)`
	top: 0;
	left: 0;
	content: "";
	width: 100%;
	height: 100%;
	display: block;
	position: absolute;
	background: ${(props) => props.theme.color.primary};
	transform-origin: left center;
	will-change: transform;
`;

export const Title = styled.div`
	top: 16%;
	left: 4.5%;
	width: 85%;
	position: absolute;
	z-index: 1;
`;
