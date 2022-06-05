import { a } from "react-spring";
import styled from "styled-components";

import { Image } from "@components/common/ui/Image/styled";

export const TemplatesGrid = styled.div`
	display: flex;
	height: 100%;
	width: 100%;
	align-items: center;
	justify-content: center;
	position: absolute;
	flex-direction: column;
	z-index: 1;
`;

export const TemplatesRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const TemplateGroup = styled.div`
	padding: 1.5rem 1.5rem;
	position: relative;
`;

export const TemplateWrapper = styled.div`
	width: 100%;
	height: 100%;
`;

interface TemplateProps {
	$overlay?: boolean;
}

export const Template = styled(a.div)<TemplateProps>`
	top: 0;
	left: 0;
	position: ${(props) => props.$overlay && "absolute"};
	width: var(--template-card-width);
	height: var(--template-card-height);
	border-radius: 1rem;
	background: yellow;
	overflow: hidden;
	transform-style: preserve-3d;
	backface-visibility: none;
	will-change: transform;

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
