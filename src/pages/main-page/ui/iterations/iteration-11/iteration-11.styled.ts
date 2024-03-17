import { animated } from "@react-spring/web";
import styled from "styled-components";

import { styledMixin } from "@shared/styled";
import { Image as _Image } from "@shared/ui";

export const Tariffs = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	display: flex;
	margin-top: 40px;
	position: absolute;
	align-items: center;
	flex-direction: column;
	justify-content: center;
`;

export const Head = styled(animated.div)`
	margin-bottom: 60px;
`;

export const Title = styled.p`
	${styledMixin.textMixin}
	font-size: 80px;
	text-align: center;
`;

export const Subtitle = styled.p`
	font-weight: 400;
	font-size: 16px;
	text-align: center;
	margin-top: 10px;
`;

export const Body = styled.div`
	position: relative;
`;

export const Ray = styled.div`
	display: flex;
	align-items: flex-end;
`;

export const Price = styled(animated.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	max-width: 70%;
	position: absolute;
	align-items: center;
	justify-content: center;
`;

export const PriceContent = styled.div`
	max-width: 100%;
	max-height: 100%;
	margin-top: 20px;
`;

export const RayPiece = styled(animated.div)`
	width: calc(270px * var(--scale));
	height: calc(300px * var(--scale));
	transform-origin: center;
	will-change: transform;

	--scale: 1;

	&:nth-child(1) {
		--scale: 0.8;
	}

	&:nth-child(2) {
		--scale: 0.9;
	}

	&:not(:last-child) {
		margin-right: -50px;
	}
`;

export const Image = styled(_Image)`
	width: 100%;
`;
