import { animated } from "@react-spring/web";
import styled from "styled-components";

import { styledMixin } from "@shared/styled";
import { Image } from "@shared/ui";

import { TextAnimation } from "../../text-animation";

export const Grid = styled(animated.div)`
	top: 0;
	left: 0;
	width: 100%;
	z-index: 999;
	height: 100%;
	position: absolute;
`;

export const Layer = styled(animated.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	position: absolute;
	z-index: 1;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`;

export const Row = styled(animated.div)`
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const PresentationGroup = styled.div`
	padding: 14px 14px;
	box-sizing: border-box;
	position: relative;
	pointer-events: none;
`;

export const PresentationWrapper = styled.div`
	width: 100%;
	height: 100%;
`;

export const Presentation = styled(animated(Image))<{ $overlay?: boolean }>`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: absolute;
	border-radius: 10px;
	backface-visibility: none;
	transform-style: preserve-3d;
	position: ${({ $overlay }) => $overlay && "absolute"};

	${Image.S.Image} {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

export const Description = styled(TextAnimation)`
	${styledMixin.textMixin}
	font-size: 90px;
	text-align: center;
	white-space: nowrap;
	position: relative;
	z-index: 1;
`;
