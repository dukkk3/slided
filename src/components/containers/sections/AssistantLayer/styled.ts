import { a } from "react-spring";
import styled from "styled-components";

export const AssistantLayer = styled.div`
	width: 100%;
	height: 100%;
`;

export const Layer = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	display: flex;
	position: absolute;
	flex-direction: column;
	align-items: center;
	text-align: center;
`;

export const AssistantFaceContainer = styled.div`
	width: 15rem;
	height: 15rem;
`;

export const AssistantFace = styled(a.div)`
	width: 100%;
	height: 100%;
	position: relative;
`;

export const AssistantFaceContentLayer = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
`;

export const AssistantFaceVideoWrapper = styled(a.div)`
	width: 100%;
	height: 100%;
	overflow: hidden;
	border-radius: 50%;
	-webkit-mask-image: -webkit-radial-gradient(white, black);

	video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

const ASSISTANT_FACE_BACKGROUND_ADDITIONAL_SIZE = "1.6rem";

export const AssistantFaceBackground = styled(AssistantFaceContentLayer)`
	top: -${ASSISTANT_FACE_BACKGROUND_ADDITIONAL_SIZE};
	left: -${ASSISTANT_FACE_BACKGROUND_ADDITIONAL_SIZE};
	width: calc(100% + ${ASSISTANT_FACE_BACKGROUND_ADDITIONAL_SIZE} * 2);
	height: calc(100% + ${ASSISTANT_FACE_BACKGROUND_ADDITIONAL_SIZE} * 2);
`;

export const AssistantFacePulse = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.35);
`;

export const AssistantFaceCircle = styled.div`
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

export const Description = styled.div`
	text-align: center;
	font-size: 3.2rem;
	font-weight: 700;
	margin-top: 2.8rem;
	line-height: 100%;
	position: relative;
	width: 100%;
	color: black;
`;

export const DescriptionContent = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	position: absolute;
`;
