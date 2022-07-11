import { a } from "react-spring";
import styled from "styled-components";

import { mobile } from "@styles/breakpoint";

export const Dots = styled.div`
	z-index: 999;
	display: flex;
	position: absolute;
	flex-direction: column;
	justify-content: center;
	top: var(--header-height);
	right: var(--container-gap);
	mix-blend-mode: multiply;
	height: calc(100vh - var(--header-height));

	--dot-size: 2.4rem;

	${mobile`
		display: none;
	`}
`;

interface DotProps {
	$active?: boolean;
}

export const Dot = styled.button<DotProps>`
	width: var(--dot-size);
	height: var(--dot-size);
	position: relative;
	z-index: 1;

	&:after {
		content: "";
		border-radius: 50%;
		position: absolute;
		width: var(--size);
		height: var(--size);
		top: calc(50% - var(--size) / 2);
		left: calc(50% - var(--size) / 2);
		transition: background 0.3s ease;
		background: ${(props) => (props.$active ? props.theme.color.primary : "black")};

		--size: 0.4rem;
	}
`;

export const FlyingDot = styled(a.div)`
	top: 0;
	left: 0;
	width: var(--dot-size);
	height: var(--dot-size);
	background: rgba(0, 0, 0, 0.4);
	position: absolute;
	pointer-events: none;
	border-radius: 50%;
`;

export const DotGroup = styled.div`
	display: flex;
	position: relative;
	flex-direction: column;
	justify-content: center;
`;
