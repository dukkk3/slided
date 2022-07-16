import styled from "styled-components";

import { mobile } from "@styles/breakpoint";

export const DebugIterationControls = styled.div`
	flex-direction: column;
	font-size: 2.4rem;
	position: fixed;
	z-index: 999999;
	display: flex;
	bottom: 4rem;
	color: white;
	left: 4rem;

	p > span {
		background: rgba(0, 0, 0, 0.4);
	}

	p,
	p span {
		vertical-align: initial;
	}

	${mobile`
		display: none;
	`}
`;
