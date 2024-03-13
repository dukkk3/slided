import { animated } from "@react-spring/web";
import styled from "styled-components";

import { styledMixin } from "@shared/styled";

import { AssistantCanvas as _AssistantCanvas } from "./assistant.model";

export const AssistantCanvas = styled(_AssistantCanvas)`
	width: 100%;
	height: 100%;
`;

export const Assistant = styled(animated.div)`
	top: 0;
	left: 0;
	position: absolute;
`;

export const AssistantCircle = styled(animated.circle)`
	stroke-width: 2;
	stroke-linecap: round;
	transform-origin: center;
	transform: rotate(-90deg);
	fill: transparent;
	stroke: ${(props) => props.theme.color.accent.primary};
`;

export const BorderWrapper = styled(animated.div)`
	pointer-events: none;
	position: absolute;
`;

export const Border = styled.div`
	${styledMixin.generateOutsideBorderMixin("4px")}
`;

const BACKGROUND_OUTER_OFFSET = "14px";

export const Face = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
`;

export const Content = styled.div`
	top: 0;
	left: 0;
	z-index: 1;
	width: 100%;
	height: 100%;
	position: absolute;
`;

export const AssistantInvertCanvasWrapper = styled(animated.div)`
	width: 100%;
	height: 100%;
`;

export const AssistantCanvasWrapper = styled(animated.div)`
	width: 100%;
	height: 100%;
	overflow: hidden;
	border-radius: 50%;
`;

export const Background = styled(Content)`
	top: -${BACKGROUND_OUTER_OFFSET};
	left: -${BACKGROUND_OUTER_OFFSET};
	width: calc(100% + ${BACKGROUND_OUTER_OFFSET} * 2);
	height: calc(100% + ${BACKGROUND_OUTER_OFFSET} * 2);
`;

export const Pulse = styled(animated.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.35);
`;

export const Circle = styled(animated.div)`
	top: 0;
	left: 0;
	z-index: 1;
	width: 100%;
	height: 100%;
	position: absolute;
`;
