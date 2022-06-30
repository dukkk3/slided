import styled from "styled-components";

import {
	FillingContainer,
	Content as ContentImpl,
} from "@components/common/ui/FillingContainer/styled";

import { breakpoint } from "@styles/breakpoint";

export const Footer = styled.div`
	width: 100%;
	height: 100%;
	z-index: 9999;

	${FillingContainer} {
		touch-action: none;
		/* overflow: initial; */

		${ContentImpl} {
			background: black;
			border-radius: 3rem 3rem 0 0;
		}
	}
`;

export const Content = styled.div`
	display: flex;
	padding: 4rem 0;
	flex-direction: column;
	justify-content: space-between;
	min-height: calc(100vh - var(--header-height));
`;

export const Head = styled.div`
	margin: 6rem 0;

	${breakpoint("mobile", "tablet")`
		margin-top: 1rem;
	`}
`;

export const Title = styled.p`
	font-weight: 600;
	font-size: 8rem;
	line-height: 100%;
	text-align: center;
	color: white;

	${breakpoint("mobile", "tablet")`
		font-weight: 700;
		font-size: 2.8rem;
		line-height: 140%;
	`}
`;

export const ButtonWrapper = styled.div`
	display: flex;
	margin-top: 4rem;
	justify-content: center;

	${breakpoint("mobile", "tablet")`
		margin-top: 5rem;
	`}
`;

export const Features = styled.div`
	display: flex;
	padding: 0 4rem;
	margin: 10rem 0 14rem;
	justify-content: space-between;

	${breakpoint("mobile", "tablet")`
		border-top: 1px solid rgba(255, 255, 255, .4);
		padding: 1rem 0 0;
		flex-wrap: wrap;
		margin: 0;
	`}
`;

export const Feature = styled.div`
	${breakpoint("mobile", "tablet")`
		flex: 0 0 50%;
		padding: 1rem 0;
	`}
`;

export const FeatureHead = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 1rem;

	${breakpoint("mobile", "tablet")`
		margin-bottom: 0;
	`}
`;

export const FeatureBody = styled.div`
	display: flex;
	position: relative;
	align-items: center;

	${breakpoint("mobile", "tablet")`
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

	${breakpoint("mobile", "tablet")`
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
