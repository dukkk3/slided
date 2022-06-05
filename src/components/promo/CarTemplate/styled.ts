import { a } from "react-spring";
import styled from "styled-components";

import { Image } from "@components/common/ui/Image/styled";

export const CarTemplate = styled.div`
	width: 100%;
	height: 100%;
`;

export const Template = styled.div`
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: relative;
	border-radius: 1rem;
`;

interface ImageWrapperProps {
	$zoom: number;
}

export const ImageWrapper = styled(a.div)<ImageWrapperProps>`
	position: absolute;
	top: ${(props) => ((1 - props.$zoom) / 2) * 100}%;
	left: ${(props) => ((1 - props.$zoom) / 2) * 100}%;
	width: ${(props) => props.$zoom * 100}%;
	height: ${(props) => props.$zoom * 100}%;
	transform-origin: center;
	will-change: transform;

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
