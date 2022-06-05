import { a } from "react-spring";
import styled, { css } from "styled-components";

import {
	Description as PhoneCardDescription,
	DescriptionWrapper as PhoneCardDescriptionWrapper,
} from "@components/promo/PhoneCard/styled";
import { Image } from "@components/common/ui/Image/styled";

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
	background: grey;
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

export const AssistantFaceAnimatedWrapper = styled(a.div)`
	width: 100%;
	height: 100%;
	transform-origin: center;
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
			${PhoneCardDescriptionWrapper} {
				margin: 4rem 0;

				${PhoneCardDescription} {
					top: 0 !important;
				}
			}
		`}
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

export const TemplateCard = styled(a.div)`
	top: 0;
	left: 0;
	position: absolute;
	overflow: hidden;
	border-radius: 1rem;
	z-index: 9;

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

export const TemplatesGridWrapper = styled(a.div)`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: absolute;
`;

export const TemplatesGridTitle = styled.div`
	line-height: 60%;
	font-weight: 600;
	font-size: 9rem;
	margin-top: -0.1em;
	text-align: center;
	position: relative;
	z-index: 1;
`;

export const TariffWrapper = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: 11;
`;
