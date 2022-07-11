import { a } from "react-spring";
import styled from "styled-components";

export const Layout = styled.div`
	height: 100vh;
	overflow: hidden;
`;

export const HeaderWrapper = styled(a.header)`
	top: 0;
	left: 0;
	width: 100vw;
	position: fixed;
	z-index: 9998;
`;

export const FeedbackWrapper = styled(a.div)`
	width: 100vw;
	height: 100vh;
	/* height: calc(100vh - var(--header-height)); */
	position: fixed;
	z-index: 9999;
	top: 0;
	left: 0;
`;
