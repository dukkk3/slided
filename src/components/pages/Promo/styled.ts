import { a } from "react-spring";
import styled from "styled-components";

export const Promo = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	overflow: hidden;
	position: absolute;
	touch-action: none;
	backface-visibility: hidden;
`;

export const SlidingGroup = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	position: absolute;
	z-index: 9999;
`;
