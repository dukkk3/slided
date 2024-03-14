import { animated } from "@react-spring/web";
import styled from "styled-components";

import { styledMixin } from "@shared/styled";
import { Image } from "@shared/ui";

export const Slide = styled.div`
	width: 100%;
	height: 80px;
	position: absolute;
	bottom: 0;
	left: 0;
	touch-action: none;
	cursor: grab;
	overflow: hidden;
	background: #e4e4e4;
	border-radius: 900px;
`;

export const SlideContent = styled(animated.div)`
	width: calc(100% - 80px);
	height: 100%;
	position: relative;
	pointer-events: none;
	border-radius: inherit;
	z-index: 1;

	&:after {
		top: 0;
		right: calc(100% - 70px * 2);
		content: "";
		width: calc(100% + 70px * 3);
		height: 100%;
		border-radius: inherit;
		position: absolute;
		background: linear-gradient(90deg, var(--background) 80%, rgba(255, 255, 255, 0));
	}
`;

export const SlideButton = styled.div`
	top: 5px;
	left: 5px;
	z-index: 1;
	padding: 6px;
	box-sizing: border-box;
	position: absolute;
	border-radius: 50%;
	background: white;
	${styledMixin.square("70px")}
`;

export const SlideButtonImage = styled(Image)`
	width: 100%;
	height: 100%;
	pointer-events: none;
`;

export const SlideButtonLabelGroup = styled(animated.div)`
	top: 0;
	left: 80px;
	height: 100%;
	display: flex;
	position: absolute;
	align-items: center;
	pointer-events: none;
	justify-content: center;
	width: calc(100% - 80px);
`;

export const SlideButtonLabel = styled.p`
	font-size: 18px;
	font-weight: 600;
	opacity: 0.6;
`;
