import { a } from "react-spring";
import styled from "styled-components";

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
