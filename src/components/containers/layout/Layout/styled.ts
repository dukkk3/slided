import { a } from "react-spring";
import styled from "styled-components";

export const Layout = styled.div``;

export const HeaderWrapper = styled.header`
	top: 0;
	left: 0;
	width: 100%;
	position: fixed;
	z-index: 9998;
`;

export const FeedbackWrapper = styled(a.div)`
	width: 100%;
	height: 100vh;
	/* height: calc(100vh - var(--header-height)); */
	position: fixed;
	z-index: 9999;
	top: 0;
	left: 0;
`;
