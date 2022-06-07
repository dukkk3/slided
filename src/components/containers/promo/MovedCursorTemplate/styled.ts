import { a } from "react-spring";
import styled from "styled-components";

import { Image } from "@components/common/ui/Image/styled";

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
	width: calc(100% * var(--scale-x));
	height: calc(100% * var(--scale-y));
	will-change: width, height, transform;
	backface-visibility: none;
	transform-style: preserve-3d;

	--scale-x: 1;
	--scale-y: 1;
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

export const CursorGroup = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: 9999;
	transform-origin: left top;
	will-change: transform;
`;
