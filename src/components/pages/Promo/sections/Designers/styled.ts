import { a } from "react-spring";
import styled from "styled-components";

import { mobile } from "@styles/breakpoint";

export const Designers = styled.div`
	width: 100%;

	${mobile`
		position: absolute;
		padding-top: 4rem;
		box-sizing: content-box;
		// margin-top: calc(var(--header-height) * -1);
		// margin-left: calc(var(--container-gap) * -1);
	`}
`;

export const Content = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	visibility: hidden;

	> * {
		visibility: visible;
	}
`;

export const ProfileCardGroup = styled.div`
	top: 0;
	left: 0;
	position: absolute;
	transform-origin: center;

	${mobile`
		width: 100%;
		position: relative;
		margin-bottom: 1rem;
	`}
`;

export const ProfileCardWrapper = styled(a.div)`
	transform-origin: center;
	will-change: transform;
`;
