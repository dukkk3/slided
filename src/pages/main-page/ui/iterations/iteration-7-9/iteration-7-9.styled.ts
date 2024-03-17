import { animated } from "@react-spring/web";
import styled from "styled-components";

import { styledMixin } from "@shared/styled";
import { Button as _Button, Image } from "@shared/ui";

import { Phone as _Phone } from "../../phone";
import { TextAnimation } from "../../text-animation";

export const PhoneWrapper = styled(animated.div)``;

export const Phone = styled(_Phone)`
	height: min(700px, 100%);
`;

export const Descriptions = styled.div`
	position: relative;
	margin-top: 28px;
	text-align: center;
	width: 100%;
`;

export const Description = styled(TextAnimation)<{ $withAbsolutePosition?: boolean }>`
	${styledMixin.textMixin}
	left: 0;
	width: 100%;
	font-size: 28px;
	top: 0;
	/* top: ${({ $withAbsolutePosition }) => $withAbsolutePosition && "34px"}; */
	position: ${({ $withAbsolutePosition }) => $withAbsolutePosition && "absolute"};
`;

export const Button = styled(animated(_Button))`
	width: 100%;
	bottom: 20px;
	position: absolute;
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

export const PresentationCardsWrapper = styled.div`
	margin-top: 80px;
`;

export const DonePresentationCards = styled.div`
	position: relative;
	margin-top: -7.5px;
`;

export const PresentationWrapper = styled.div<{ $overlay?: boolean }>`
	top: 0;
	left: 0;
	width: 100%;
	padding: 6px 0;
	position: ${({ $overlay }) => ($overlay ? "absolute" : "relative")};
`;

export const PresentationCard = styled(animated.div)`
	width: 100%;
	overflow: hidden;
	position: relative;
	border-radius: 10px;
	aspect-ratio: 16/9;
	transform-origin: center top;
`;

export const PresentationOverlayCardContent = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: absolute;
`;

export const PresentationOverlayWrapper = styled(animated.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: absolute;
	will-change: height;
`;

export const Scan = styled(animated.div)`
	top: 0;
	left: 0;
	z-index: 9;
	height: 3px;
	width: 100%;
	position: absolute;
	background: ${({ theme }) => theme.color.accent.primary};

	&:after {
		left: 0;
		top: -50%;
		content: "";
		width: 100%;
		height: 200%;
		position: absolute;
		filter: blur(10px);
		background: ${({ theme }) => theme.color.accent.primary};
	}
`;

export const Presentation = styled(Image)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;

	${Image.S.Image} {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;
