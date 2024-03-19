import { animated } from "@react-spring/web";
import styled from "styled-components";

import { PresentationCanvas as _PresentationCanvas } from "./iteration-7-8.model";

export const PresentationWrapper = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 99;
	position: absolute;
`;

export const Presentation = styled(animated.div)`
	overflow: hidden;
	position: absolute;
	border-radius: 10px;
	width: 100%;
	height: 100%;
	backface-visibility: none;
	transform-style: preserve-3d;
`;

export const PresentationCanvas = styled(_PresentationCanvas)`
	width: 100%;
	height: 100%;
`;

export const PresentationCanvasWrapper = styled(animated.div)<{ $zoom: number }>`
	top: ${({ $zoom }) => ((1 - $zoom) / 2) * 100}%;
	left: ${({ $zoom }) => ((1 - $zoom) / 2) * 100}%;
	width: ${({ $zoom }) => $zoom * 100}%;
	height: ${({ $zoom }) => $zoom * 100}%;
	position: absolute;
`;
