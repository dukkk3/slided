import { a } from "react-spring";
import styled, { css } from "styled-components";

import { Image } from "@components/common/ui/Image/styled";

import { mobile } from "@styles/breakpoint";

export const TemplatesGrid = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	z-index: 999;
	height: 100%;
	position: absolute;
	will-change: transform, opacity;
`;

export const Layer = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	position: absolute;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`;

export const Row = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const TemplateGroup = styled.div`
	padding: 1.5rem 1.5rem;
	position: relative;

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
	width: var(--template-card-width);
	height: var(--template-card-height);
	border-radius: 1rem;
	overflow: hidden;
	transform-style: preserve-3d;
	backface-visibility: none;
	will-change: transform;

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
