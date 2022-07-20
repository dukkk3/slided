import { a } from "react-spring";
import styled, { css } from "styled-components";

import { Image } from "@components/common/ui/Image/styled";

import { mobile } from "@styles/breakpoint";

export const GridTemplates = styled(a.div)`
	top: 0;
	left: calc(var(--container-gap) * -1);
	width: calc(100% + var(--container-gap) * 2);
	z-index: 999;
	height: 100%;
	cursor: grab;
	position: absolute;
	/* pointer-events: none; */
	will-change: transform, opacity;
`;

export const Layer = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	pointer-events: none;
	position: absolute;
	z-index: 1;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	will-change: transform;
`;

export const Row = styled(a.div)`
	display: flex;
	align-items: center;
	justify-content: center;
	will-change: transform;
`;

export const TemplateGroup = styled.div`
	padding: 1.5rem 1.5rem;
	position: relative;
	pointer-events: none;

	${mobile`
		padding: .5rem;
	`}
`;

export const TemplateWrapper = styled.div`
	width: 100%;
	height: 100%;
`;

interface TemplateProps {
	$overlay?: boolean;
	$containsText?: boolean;
}

const templateContainsTextMixin = css`
	display: flex;
	text-align: center;
	align-items: center;
	justify-content: center;
	border: 1px solid black;
	line-height: 120%;
	font-weight: 600;
	font-size: 2.8rem;
`;

export const Template = styled(a.div)<TemplateProps>`
	top: 0;
	left: 0;
	position: ${(props) => props.$overlay && "absolute"};
	border-radius: 1rem;
	overflow: hidden;
	transform-style: preserve-3d;
	backface-visibility: none;
	will-change: transform, opacity;

	${(props) => props.$containsText && templateContainsTextMixin};

	${Image} {
		width: 100%;
		height: 100%;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
`;

export const Title = styled.div`
	line-height: 60%;
	font-weight: 600;
	font-size: 9rem;
	margin-top: -0.1em;
	text-align: center;
	white-space: nowrap;
	position: relative;
	z-index: 1;
`;

export const ArrowsIconGroup = styled(a.div)`
	margin-top: 2rem;
`;
