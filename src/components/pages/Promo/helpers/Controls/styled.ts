import { a } from "react-spring";
import styled from "styled-components";

import { mobile } from "@styles/breakpoint";

export const Dots = styled.div`
	z-index: 9997;
	display: flex;
	visibility: hidden;
	position: fixed;
	flex-direction: column;
	justify-content: center;
	top: var(--header-height);
	right: var(--container-gap);
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
		background: ${(props) => (props.$active ? props.theme.color.primary : "var(--inactive-color)")};

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
	transition: background 0.3s ease;

	svg {
		stroke: inherit;
	}

	circle {
		stroke: ${(props) => props.theme.color.primary};
		stroke-width: 1rem;
		stroke-linecap: round;
		transform-origin: center;
		transform: rotate(-90deg);
		fill: transparent;
	}
`;

interface DotGroupProps {
	$invert?: boolean;
}

export const DotGroup = styled.div<DotGroupProps>`
	display: flex;
	position: relative;
	flex-direction: column;
	justify-content: center;
	visibility: visible;

	${FlyingDot} {
		background: ${(props) => (props.$invert ? "rgba(255, 255, 255, .4)" : "rgba(0, 0, 0, .4)")};
	}

	${Dot} {
		--inactive-color: white;
	}
`;
