import { a } from "react-spring";
import styled from "styled-components";

import { breakpoint } from "@styles/breakpoint";

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
`;

export const Head = styled(a.div)`
	margin-bottom: 6rem;
	will-change: transform;

	${breakpoint("mobile", "tablet")`
		margin-bottom: 4rem;
	`}
`;

export const Title = styled.p`
	font-size: 8rem;
	line-height: 80%;
	font-weight: 600;
	text-align: center;

	${breakpoint("mobile", "tablet")`
		font-weight: 700;
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

	${breakpoint("mobile", "tablet")`
		width: 80%;
		margin: 0 10%;
	`}
`;

export const PriceContent = styled.div`
	max-width: 100%;
	max-height: 100%;
	margin-top: 2rem;
`;

export const RayPiece = styled(a.div)`
	width: calc(30rem * var(--scale));
	height: calc(34rem * var(--scale));
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

	${breakpoint("mobile", "tablet")`
		width: calc(17rem * var(--scale));
		height: calc(20rem * var(--scale));
	`}
`;
