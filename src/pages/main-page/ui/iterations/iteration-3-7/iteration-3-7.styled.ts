import { animated } from "@react-spring/web";
import styled from "styled-components";

import { styledMixin } from "@shared/styled";
import { Button as _Button, Image } from "@shared/ui";

import { TextAnimation } from "../../text-animation";

import { Phone as _Phone, Slider as _Slider } from "./ui";

export const PhoneWrapper = styled(animated.div)``;

export const Phone = styled(_Phone)`
	height: 700px;
	max-height: 100%;

	${_Phone.S.Content}, ${_Phone.S.ContentWrapper} {
		height: 100%;
	}
`;

export const Face = styled.div`
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

export const FaceContainer = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
`;

export const TemplateCardsContainer = styled.div`
	position: relative;
`;

export const RayImage = styled(animated(Image))`
	width: 100%;
	top: -30px;
	display: flex;
	align-items: center;
	height: 100%;
	position: absolute;
	justify-content: center;

	svg {
		height: calc(100% - 80px);
		max-height: 140px;
	}
`;

export const TemplateCardImage = styled(Image)`
	width: 100%;
	height: 100%;

	${Image.S.Image} {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

export const TemplateCardsWrapper = styled(animated.div)`
	margin: 20px 0;
`;

export const Slider = styled(animated(_Slider))`
	width: 100%;
	${styledMixin.fixedSize("60px", "height")}
`;

export const Button = styled(animated(_Button))`
	width: 100%;
	border-radius: 900px;
	${styledMixin.fixedSize("60px", "height")}
`;

export const PhoneFooter = styled.div`
	z-index: 1;
	width: 100%;
	position: relative;

	> * {
		left: 0;
		bottom: 0;
		position: absolute;
	}
`;

export const TemplateCards = styled.div`
	perspective: 10px;
	position: relative;
	padding-bottom: 56.25%;
`;

export const TemplateCard = styled(animated.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: absolute;
	border-radius: 30px;
	border: 1px solid rgba(255, 255, 255, 0.3);
	transform-origin: center;
	transform-style: preserve-3d;
	backface-visibility: hidden;
`;

export const TemplateCardImageWrapper = styled(animated.div)`
	width: 100%;
	height: 100%;
`;

export const Descriptions = styled.div`
	position: relative;
	margin-top: 2.8rem;
	text-align: center;
	width: 100%;
`;

export const Description = styled(TextAnimation)<{ $withAbsolutePosition?: boolean }>`
	${styledMixin.textMixin}
	left: 0;
	width: 100%;
	font-size: 28px;
	top: ${({ $withAbsolutePosition }) => $withAbsolutePosition && "34px"};
	position: ${({ $withAbsolutePosition }) => $withAbsolutePosition && "absolute"};
`;

export const BoldDescription = styled(Description)`
	font-size: 42px;
`;
