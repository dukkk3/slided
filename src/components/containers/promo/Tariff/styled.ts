import { a } from "react-spring";
import styled from "styled-components";

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

export const Title = styled(a.p)`
	font-size: 8rem;
	line-height: 80%;
	font-weight: 600;
	margin-bottom: 6rem;
	will-change: transform, opacity;
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
	align-items: center;
	justify-content: center;
	position: absolute;
	font-size: 2rem;
	font-weight: 600;
	will-change: transform, opacity;
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
`;