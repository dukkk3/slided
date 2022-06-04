import { Button } from "@components/common/ui/Button/styled";
import { a } from "react-spring";
import styled, { css } from "styled-components";

export const Content = styled.div`
	/* height: 500rem; */
	height: 100vh;
`;

export const Sandbox = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	position: absolute;
	will-change: transform;
	backface-visibility: hidden;
`;

interface LayerWrapperProps {
	$fullscreen?: boolean;
}

export const LayerWrapper = styled.div<LayerWrapperProps>`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
`;

export const descriptionMixin = css`
	line-height: 100%;
	font-weight: 700;
	text-align: center;
	color: black;
`;

export const AssistantLayout = styled.div`
	visibility: hidden;
	display: flex;
	width: 100%;
	flex-direction: column;
	align-items: center;
	text-align: center;
`;

export const AssistantFaceWrapper = styled.div`
	width: 15rem;
	height: 15rem;
	visibility: visible;
`;

export const AssistantFaceAnimatedWrapper = styled(a.div)`
	width: 100%;
	height: 100%;
	transform-origin: center;
`;

export const AssistantDescriptionWrapper = styled.div`
	visibility: visible;
	position: relative;
	margin-top: 2.8rem;
	font-size: 3.2rem;
	width: 100%;
	${descriptionMixin}
`;

interface PhoneDescriptionProps {
	$big?: boolean;
	$overlay?: boolean;
}

export const PhoneDescriptionWrapper = styled.div`
	position: relative;
	margin-top: 2.8rem;
	font-size: 2.8rem;
	width: 100%;
	${descriptionMixin}
`;

export const PhoneDescription = styled.div<PhoneDescriptionProps>`
	left: 0;
	width: 100%;
	top: ${(props) => props.$overlay && "3.4rem"};
	font-size: ${(props) => props.$big && "4.8rem"};
	line-height: ${(props) => props.$big && "70%"};
	position: ${(props) => props.$overlay && "absolute"};
`;

export const PromoWrapper = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	position: absolute;
`;

interface PhoneWrapperProps {
	$alternative?: boolean;
}

export const PhoneWrapper = styled.div<PhoneWrapperProps>`
	top: 0;
	left: 0;
	width: 100%;
	position: absolute;
	height: calc(100% - var(--container-gap));

	${(props) =>
		props.$alternative &&
		css`
			${PhoneDescriptionWrapper} {
				margin: 4rem 0;

				${PhoneDescription} {
					top: 0 !important;
				}
			}
		`}
`;

export const PhoneReadyTemplatesCardsWrapper = styled.div`
	margin-top: 2rem;
`;

export const PhoneFace = styled.div`
	width: 10rem;
	height: 10rem;
	margin: 5rem auto 0;
	position: relative;
`;

export const PhoneButtonWrapper = styled.div`
	position: relative;
	width: 100%;
	height: var(--height);

	--height: 6rem;

	${Button} {
		width: 100%;
		height: 100%;
		border-radius: 90rem;
	}

	> * {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		cursor: default;
		border-radius: 90rem;
		position: absolute;
	}
`;

export const PhoneSlide = styled.div`
	width: 100%;
	height: 100%;
	border-radius: inherit;
	background: radial-gradient(100% 87.77% at 100% 0%, #acb3bf 0%, #dddee1 100%);
`;

export const PhoneSlideContent = styled(a.div)`
	width: calc(100% - var(--height));
	height: 100%;
	position: relative;

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

export const PhoneFaceWrapper = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
`;

export const PhoneCards = styled(a.div)`
	margin: 2.4rem 0;
`;

export const ExecutorsWrapper = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
	visibility: hidden;

	> * {
		visibility: visible;
	}
`;

interface PulseCircle {
	$theme?: "green" | "white";
}

export const PulseCircle = styled(a.div)<PulseCircle>`
	top: calc(50% - var(--size) / 2);
	left: calc(50% - var(--size) / 2);
	position: absolute;
	width: var(--size);
	height: var(--size);
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

	--size: max(150vh, 150vw);
`;

export const StartCarTemplatePosition = styled.div`
	top: calc((50vh - var(--height) / 2) - var(--header-height));
	left: calc((50vw - var(--width) / 2) - var(--container-gap));
	width: var(--width);
	height: var(--height);
	position: absolute;
	opacity: 0;
	pointer-events: none;

	--width: calc(var(--size-unit) * 1.6 * 1.25);
	--height: calc(var(--size-unit) * 0.9 * 1.25);
	--size-unit: max(100vw, 100vh);
`;

export const CarTemplateWrapper = styled(a.div)`
	top: 0;
	left: 0;
	width: calc(100% * var(--scale-x));
	height: calc((100% - var(--container-gap)) * var(--scale-y));
	position: absolute;
	z-index: 99;
	will-change: width, height, transform;

	--scale-x: 1;
	--scale-y: 1;
`;

interface FillProps {
	$asPromoContainer?: boolean;
}

export const Fill = styled.div<FillProps>`
	top: 0;
	left: 0;
	opacity: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	position: absolute;
`;

export const FillPromoContainerWrapper = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	position: absolute;
	padding-bottom: 56.25%;
`;

export const UserCursorWrapper = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
	transform-origin: left top;
`;
