import { a } from "react-spring";
import styled from "styled-components";

const BACKGROUND_OUTER_OFFSET = "1.4rem";

export const AssistantFace = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
`;

export const Content = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
`;

export const VideoWrapper = styled(a.div)`
	width: 100%;
	height: 100%;
	overflow: hidden;
	border-radius: 50%;
	will-change: transform;

	video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		will-change: transform;
	}
`;

export const Background = styled(Content)`
	top: -${BACKGROUND_OUTER_OFFSET};
	left: -${BACKGROUND_OUTER_OFFSET};
	width: calc(100% + ${BACKGROUND_OUTER_OFFSET} * 2);
	height: calc(100% + ${BACKGROUND_OUTER_OFFSET} * 2);
`;

export const Pulse = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.35);
	will-change: transform;
`;

export const Circle = styled(a.div)`
	top: 0;
	left: 0;
	z-index: 1;
	width: 100%;
	height: 100%;
	position: absolute;
	stroke: ${(props) => props.theme.color.primary};

	svg {
		stroke: inherit;
	}

	circle {
		stroke: inherit;
		stroke-width: 2;
		stroke-linecap: round;
		transform-origin: center;
		transform: rotate(-90deg);
		fill: rgba(255, 255, 255, 0);
	}
`;
