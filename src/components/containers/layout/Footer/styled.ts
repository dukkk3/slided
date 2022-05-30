import styled from "styled-components";

import {
	FullScreenContainerLayout,
	Content as ContentImpl,
} from "@components/common/ordinary/FullScreenContainerLayout/styled";

import { Button } from "@components/common/ui/Button/styled";

export const Footer = styled.div`
	width: 100%;
	height: 100vh;
	top: 0;
	left: 0;
	z-index: 9999;
	position: fixed;

	${FullScreenContainerLayout} {
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
`;

export const Title = styled.p`
	font-weight: 600;
	font-size: 8rem;
	line-height: 100%;
	text-align: center;
	color: white;
`;

export const ButtonWrapper = styled.div`
	display: flex;
	margin-top: 4rem;
	justify-content: center;
`;

export const Features = styled.div`
	display: flex;
	padding: 0 4rem;
	margin: 10rem 0 14rem;
	justify-content: space-between;
`;

export const Feature = styled.div``;

export const FeatureHead = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 1rem;
`;

export const FeatureBody = styled.div`
	display: flex;
	position: relative;
	align-items: center;
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
