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
	overflow: hidden;
	position: absolute;
	touch-action: none;
	backface-visibility: hidden;
`;

export const LayerWrapper = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
`;

export const LoaderGroup = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	position: absolute;
	align-items: center;
	justify-content: center;
	z-index: 9999;
`;

export const TableBackgroundWrapper = styled(a.div)``;
