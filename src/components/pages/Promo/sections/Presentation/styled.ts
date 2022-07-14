import { a } from "react-spring";
import styled from "styled-components";

export const EndContainer = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 99;
	position: absolute;
`;

export const Card = styled(a.div)`
	overflow: hidden;
	position: absolute;
	border-radius: 1rem;
	width: 100%;
	height: 100%;
	backface-visibility: none;
	transform-style: preserve-3d;
	will-change: transform, width, height;
`;

interface CardImageGroupProps {
	$zoom: number;
}

export const CardImageGroup = styled(a.div)<CardImageGroupProps>`
	top: ${(props) => ((1 - props.$zoom) / 2) * 100}%;
	left: ${(props) => ((1 - props.$zoom) / 2) * 100}%;
	width: ${(props) => props.$zoom * 100}%;
	height: ${(props) => props.$zoom * 100}%;
	transform-origin: center;
	will-change: transform;
	position: absolute;
`;
