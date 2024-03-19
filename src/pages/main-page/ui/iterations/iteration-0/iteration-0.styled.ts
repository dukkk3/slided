import { animated } from "@react-spring/web";
import styled from "styled-components";

import { Mouse as _Mouse } from "./ui";

export const Promo = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	position: absolute;
	text-align: center;
	flex-direction: column;
`;

export const TitleWrapper = styled.div``;

export const Title = styled.h1`
	margin: 0;
	display: block;
	font-size: 74px;
	font-weight: 600;
	line-height: 100%;
	overflow: hidden;
	white-space: pre;
`;

export const SubtitleWrapper = styled.div`
	font-weight: 600;
	margin-top: 14px;
	font-size: 20px;
`;

export const Head = styled.div`
	margin-bottom: 44px;
	margin-top: 64px;
`;

export const MouseWrapper = styled(animated.div)`
	left: 0;
	width: 100%;
	bottom: 40px;
	display: flex;
	position: absolute;
	pointer-events: none;
	align-items: flex-end;
	justify-content: center;
`;

export const Mouse = styled(_Mouse)``;
