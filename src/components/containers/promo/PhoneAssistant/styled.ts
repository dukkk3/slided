import { a } from "react-spring";
import styled from "styled-components";

import { Button } from "@components/common/ui/Button/styled";
import { Image } from "@components/common/ui/Image/styled";

import { breakpoint } from "@styles/breakpoint";

export { Description, DescriptionWrapper } from "@components/common/ordinary/PhoneCard/styled";

export const Face = styled.div`
	width: 10rem;
	height: 10rem;
	margin: 0 auto;
	position: relative;
`;

export const Content = styled.div`
	padding-top: calc(var(--phone-padding) * 2);
`;

export const FaceWrapper = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
`;

export const Cards = styled(a.div)`
	margin: 2.4rem 0;
	will-change: transform, opacity;

	${breakpoint("mobile", "tablet")`
		margin: 2.4rem 0;
	`}
`;

export const Slide = styled.div`
	width: 100%;
	height: 100%;
	cursor: pointer;
	border-radius: inherit;
	background: radial-gradient(100% 87.77% at 100% 0%, #acb3bf 0%, #dddee1 100%);
`;

export const SlideContent = styled(a.div)`
	width: calc(100% - var(--height));
	height: 100%;
	position: relative;
	will-change: transform;

	&:after {
		top: 1rem;
		left: 1rem;
		content: "";
		width: calc(var(--height) - 2rem);
		height: calc(var(--height) - 2rem);
		position: absolute;
		border-radius: 50%;
		background: ${(props) => props.theme.color.primary};
	}
`;

export const ButtonWrapper = styled.div`
	width: 100%;
	position: relative;
	height: var(--height);

	--height: 6rem;

	${Button} {
		width: 100%;
		height: 100%;
		border-radius: 90rem;
	}

	> div,
	.unit {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		position: absolute;
	}

	.unit {
		border-radius: 90rem;
		will-change: opacity;
	}

	${breakpoint("mobile", "tablet")`
		position: absolute;
		bottom: var(--phone-padding);
		left: var(--phone-padding);
		width: calc(100% - var(--phone-padding) * 2);
	`}
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

export const TemplatesCards = styled.div`
	perspective: 1rem;
	position: relative;
	padding-bottom: 56.25%;
`;

export const Card = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: absolute;
	border-radius: 3rem;
	border: 1px solid rgba(255, 255, 255, 0.3);
	transform-origin: center;
	transform-style: preserve-3d;
	backface-visibility: hidden;
	will-change: transform, opacity;

	${Image} {
		width: 100%;
		height: 100%;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
`;

export const CardImageWrapper = styled(a.div)`
	width: 100%;
	height: 100%;
	will-change: transform;
`;
