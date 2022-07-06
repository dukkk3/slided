import { mobile } from "@styles/breakpoint";
import { a } from "react-spring";
import styled from "styled-components";

export const Content = styled.div`
	overflow: hidden;
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

export const Dots = styled(a.div)`
	z-index: 999;
	display: flex;
	position: absolute;
	flex-direction: column;
	justify-content: center;
	top: var(--header-height);
	right: var(--container-gap);
	height: calc(100vh - var(--header-height));

	${mobile`
		display: none;
	`}
`;

interface DotProps {
	$active?: boolean;
}

export const Dot = styled.button<DotProps>`
	width: 2.4rem;
	height: 2.4rem;
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
		background: ${(props) => (props.$active ? props.theme.color.primary : "white")};

		--size: 0.4rem;
	}
`;

export const FlyingDot = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	padding-bottom: 100%;
	background: rgba(123, 123, 123, 0.4);
	position: absolute;
	pointer-events: none;
	border-radius: 50%;
`;

export const DotGroup = styled.div`
	display: flex;
	flex-direction: column;
	position: relative;
`;
