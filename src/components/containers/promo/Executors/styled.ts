import { a } from "react-spring";
import styled from "styled-components";

export const Executors = styled.div`
	width: 100%;
	height: 100%;
	visibility: hidden;

	> * {
		visibility: visible !important;
	}
`;

export const UserCardGroup = styled.div`
	top: 0;
	left: 0;
	position: absolute;
	transform-origin: center;
`;

export const UserCardWrapper = styled(a.div)`
	transform-origin: center;
	will-change: transform;
`;
