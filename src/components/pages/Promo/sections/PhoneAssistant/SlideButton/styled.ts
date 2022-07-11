import { a } from "react-spring";
import styled from "styled-components";

export const Slide = styled.div`
	width: 100%;
	height: var(--height);
	position: absolute;
	bottom: 0;
	left: 0;
	border-radius: inherit;
	touch-action: none;
	cursor: grab;
	overflow: hidden;
	background: var(--background);

	--height: 8rem;
	--background: #e4e4e4;
	--button-size: calc(var(--height) - 1rem);
`;

export const SlideContent = styled(a.div)`
	width: calc(100% - var(--height));
	height: 100%;
	position: relative;
	pointer-events: none;
	border-radius: inherit;
	will-change: transform;
	z-index: 1;

	&:after {
		top: 0;
		right: calc(100% - var(--button-size) * 2);
		content: "";
		width: calc(100% + var(--button-size) * 3);
		height: 100%;
		border-radius: inherit;
		position: absolute;
		background: linear-gradient(90deg, var(--background) 90%, rgba(255, 255, 255, 0));
	}
`;

export const SlideButton = styled.div`
	top: 0.5rem;
	left: 0.5rem;
	width: var(--button-size);
	height: var(--button-size);
	position: absolute;
	z-index: 1;
	border-radius: 50%;
	padding: 0.6rem;
	background: white;
`;

export const SlideButtonLabelGroup = styled(a.div)`
	top: 0;
	height: 100%;
	display: flex;
	position: absolute;
	align-items: center;
	left: var(--button-size);
	justify-content: center;
	width: calc(100% - var(--button-size));
`;

export const SlideButtonLabel = styled.p`
	font-size: 2rem;
	font-weight: 500;
	opacity: 0.6;
`;
