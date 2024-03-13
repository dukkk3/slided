import { animated } from "@react-spring/web";
import styled from "styled-components";

import { Button, Image } from "@shared/ui";

import {
	Phone,
	Description,
	Content as PhoneContent,
	ContentWrapper as PhoneContentWrapper,
} from "../../shared/Phone/styled";
import { styledMixin } from "@shared/styled";

export const PhoneWrapper = styled(animated.div)`
	${Phone} {
		height: 700px;
		max-height: 100%;

		${PhoneContent}, ${PhoneContentWrapper} {
			height: 100%;
		}

		${Description} {
			top: 0 !important;
		}
	}
`;

export const FaceContainer = styled.div`
	margin: 0 auto;
	position: relative;
	${styledMixin.square("100px")}
`;

export const Content = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding-top: calc(var(--phone-padding) * 2);
	height: 100%;
`;

export const FaceWrapper = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
`;

export const CardsGroup = styled.div`
	position: relative;
`;

export const RayImageGroup = styled(animated.div)`
	width: 100%;
	top: -3rem;
	display: flex;
	align-items: center;
	height: 100%;
	position: absolute;
	justify-content: center;

	svg {
		height: calc(100% - 8rem);
		max-height: 14rem;

		${mobile`
			height: calc(100% - 4rem);
		`}
	}
`;

export const Cards = styled(a.div)`
	margin: 2rem 0;
	will-change: transform, opacity;

	${mobile`
		margin: 2.4rem 0;
	`}
`;

export const ButtonWrapper = styled.div`
	z-index: 1;
	width: 100%;
	position: relative;
	${styledMixin.fixedSize("60px", "height")}

	${Button.S.Button} {
		width: 100%;
		height: 100%;
		border-radius: 900px;
	}

	.unit {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		position: absolute;
		border-radius: 900px;
		will-change: opacity;
	}
`;

export const TemplatesCards = styled.div`
	perspective: 10px;
	position: relative;
	padding-bottom: 56.25%;
`;

export const Card = styled(animated.div)`
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

	${Image.S.Picture} {
		width: 100%;
		height: 100%;

		${Image.S.Image} {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
`;

export const CardImageWrapper = styled(animated.div)`
	width: 100%;
	height: 100%;
	will-change: transform;
`;
