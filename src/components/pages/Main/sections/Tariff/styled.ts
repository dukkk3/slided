import { a } from "react-spring";
import styled from "styled-components";

import { mobile } from "@styles/breakpoint";

export const Tariff = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	position: absolute;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	visibility: hidden;

	> * {
		visibility: visible;
	}

	${mobile`
		justify-content: initial;
		margin-top: 4rem;
	`}
`;

export const Head = styled(a.div)`
	margin-bottom: 6rem;
	will-change: transform;

	${mobile`
		margin-bottom: 4rem;
	`}
`;

export const Title = styled.p`
	font-size: 8rem;
	line-height: 80%;
	font-weight: 600;
	text-align: center;

	${mobile`
		line-height: 100%;
		font-size: 3.6rem;
	`}
`;

export const Subtitle = styled.p`
	font-weight: 400;
	font-size: 1.6rem;
	text-align: center;
	margin-top: 1rem;
`;

export const Body = styled.div`
	position: relative;
`;

export const Ray = styled.div`
	display: flex;
	align-items: flex-end;
`;

export const Price = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	position: absolute;
	align-items: center;
	justify-content: center;
	will-change: transform, opacity;

	${mobile`
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 30rem;
		margin: 0 auto;
		position: absolute;
		max-width: calc(100vh - 4rem);
	`}
`;

export const PriceContent = styled.div`
	max-width: 100%;
	max-height: 100%;
	margin-top: 2rem;
`;

export const RayPiece = styled(a.div)`
	width: calc(27rem * var(--scale));
	height: calc(30rem * var(--scale));
	transform-origin: center;
	will-change: transform;

	--scale: 1;

	&:nth-child(1) {
		--scale: 0.8;
	}

	&:nth-child(2) {
		--scale: 0.9;
	}

	&:not(:nth-last-child(1)) {
		margin-right: -5rem;
	}

	${mobile`
		width: calc(30vh * var(--scale));
		height: calc(34vh * var(--scale));
	`}
`;
