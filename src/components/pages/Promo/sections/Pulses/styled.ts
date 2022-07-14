import { a } from "react-spring";
import styled from "styled-components";

export const Pulses = styled.div`
	top: 0;
	left: 0;
	z-index: 0;
	width: 100%;
	height: 100%;
	position: absolute;
	visibility: hidden;

	> * {
		visibility: visible;
	}
`;

interface PulseCircleProps {
	$theme?: "green" | "white";
}

export const PulseCircle = styled(a.div)<PulseCircleProps>`
	top: calc(50% - var(--size) / 2);
	left: calc(50% - var(--size) / 2);
	position: absolute;
	width: var(--size);
	pointer-events: none;
	height: var(--size);
	z-index: 0;
	border-radius: 50%;
	background: ${(props) =>
		props.$theme === "white"
			? "rgba(255, 255, 255, .05)"
			: `radial-gradient(
		50.94% 50.94% at 50% 50%,
		rgba(200, 255, 0, 0) 26.74%,
		rgba(200, 255, 0, 0) 39.24%,
		#c8ff00 100%
	)`};
	will-change: transform;

	--size: max(150vh, 150vw);
`;
