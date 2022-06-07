import { a } from "react-spring";
import styled from "styled-components";

export const Content = styled.div`
	/* height: 500rem; */
	height: 100vh;
`;

export const Sandbox = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	background: grey;
	position: absolute;
	backface-visibility: hidden;
`;

export const LayerWrapper = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
`;

export const CarTemplateWrapper = styled(a.div)`
	top: 0;
	left: 0;
	width: calc(100% * var(--scale-x));
	height: calc((100% - var(--container-gap)) * var(--scale-y));
	position: absolute;
	z-index: 99;
	will-change: width, height, transform;

	--scale-x: 1;
	--scale-y: 1;
`;
