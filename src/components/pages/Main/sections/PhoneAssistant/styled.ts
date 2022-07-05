import { a } from "react-spring";
import styled from "styled-components";

import { Button } from "@components/common/ui/Button/styled";
import { Image } from "@components/common/ui/Image/styled";

import { mobile } from "@styles/breakpoint";

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

	${mobile`
		margin: 2.4rem 0;
	`}
`;

export const Slide = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	border-radius: inherit;
	touch-action: none;
	cursor: grab;
	overflow: hidden;
	background: var(--background);

	--background: #e4e4e4;
	--button-size: calc(var(--height) - 1rem);
`;

export const SlideContent = styled(a.div)`
	width: calc(100% - var(--height));
	height: 100%;
	position: relative;
	pointer-events: none;
	border-radius: inherit;
	will-change: transform;
	z-index: 1;

	&:after {
		top: 0;
		right: calc(100% - var(--button-size) * 2);
		content: "";
		width: calc(100% + var(--button-size) * 3);
		height: 100%;
		border-radius: inherit;
		position: absolute;
		background: linear-gradient(90deg, var(--background) 90%, rgba(255, 255, 255, 0));
	}
`;

export const SlideButton = styled.div`
	top: 0.5rem;
	left: 0.5rem;
	width: var(--button-size);
	height: var(--button-size);
	position: absolute;
	z-index: 1;
	border-radius: 50%;
	padding: 0.6rem;
	background: white;
`;

export const SlideButtonLabelGroup = styled(a.div)`
	top: 0;
	height: 100%;
	display: flex;
	position: absolute;
	align-items: center;
	left: var(--button-size);
	justify-content: center;
	width: calc(100% - var(--button-size));
`;

export const SlideButtonLabel = styled.p`
	font-size: 1.8rem;
	font-weight: 500;
	opacity: 0.6;
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

	${mobile`
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
