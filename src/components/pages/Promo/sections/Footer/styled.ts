import { a } from "react-spring";
import styled from "styled-components";

import { SlidingContainer } from "../../shared/SlidingContainer/styled";

import { mobile } from "@styles/breakpoint";

export const Footer = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	z-index: 9999;
	position: absolute;

	${SlidingContainer} {
		touch-action: none;
	}
`;

export const Content = styled.div`
	display: flex;
	padding: 4rem 0;
	flex-direction: column;
	justify-content: space-between;
	min-height: calc(100vh - var(--header-height));

	${mobile`
		justify-content: initial;
	`}
`;

export const Head = styled.div`
	margin: 14rem 0;

	${mobile`
		margin-top: 10rem 0;
	`}
`;

export const Title = styled.p`
	font-weight: 600;
	font-size: 8rem;
	line-height: 100%;
	text-align: center;
	color: white;

	${mobile`
		font-weight: 600;
		font-size: 4.2rem;
		line-height: 140%;
	`}
`;

export const ButtonWrapper = styled.div`
	display: flex;
	margin-top: 4rem;
	justify-content: center;

	${mobile`
		margin-top: 2rem;
	`}
`;

export const Features = styled.div`
	display: flex;
	padding: 0 4rem;
	margin: 4rem 0 14rem;
	justify-content: space-between;

	${mobile`
		border: 1px solid rgba(255, 255, 255, .4);
		border-right: none;
		border-left: none;
		padding: 1rem 0;
		flex-wrap: wrap;
		margin: 0;
		margin-bottom: 2rem;
	`}
`;

export const Feature = styled.div`
	${mobile`
		flex: 0 0 50%;
		padding: 1rem 0;
	`}
`;

export const FeatureHead = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 1rem;

	${mobile`
		margin-bottom: 0;
	`}
`;

export const FeatureBody = styled.div`
	display: flex;
	position: relative;
	align-items: center;

	${mobile`
		display: none;
	`}
`;

const ICON_SIZE = "2.6rem";

export const FeatureIconWrapper = styled.div`
	width: ${ICON_SIZE};
	height: ${ICON_SIZE};
	fill: ${(props) => props.theme.color.primary};
`;

export const FeatureTitle = styled.p`
	margin-left: 1rem;
	font-weight: 700;
	font-size: 2.4rem;
	color: white;
	margin-bottom: -0.2em;

	${mobile`
		font-size: 1.8rem;
	`}
`;

export const FeatureDescription = styled(FeatureTitle)`
	font-weight: 500;
	font-size: 2rem;
	margin-bottom: 0;
`;

export const FeatureLineGroup = styled.div`
	display: flex;
	height: 100%;
	justify-content: center;
	width: ${ICON_SIZE};

	&:after {
		content: "";
		width: 1px;
		height: 100%;
		display: block;
		background: rgba(255, 255, 255, 0.5);
		position: absolute;
		top: 0;
		left: calc(${ICON_SIZE} / 2 - 1px / 2);
	}
`;
