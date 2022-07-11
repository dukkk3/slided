import { a } from "react-spring";
import styled from "styled-components";

import { Button } from "@components/common/ui/Button/styled";
import { Image } from "@components/common/ui/Image/styled";

import { mobile } from "@styles/breakpoint";

export { Description, DescriptionGroup } from "../../shared/Phone/styled";

export const Face = styled.div`
	width: 10rem;
	height: 10rem;
	margin: 0 auto;
	position: relative;
`;

export const Content = styled.div`
	padding-top: calc(var(--phone-padding) * 2);
`;

export const FaceWrapper = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
`;

export const Cards = styled(a.div)`
	margin: 2.4rem 0;
	will-change: transform, opacity;

	${mobile`
		margin: 2.4rem 0;
	`}
`;

export const ButtonWrapper = styled.div`
	width: 100%;
	position: relative;
	height: var(--height);

	--height: 6rem;

	${Button} {
		width: 100%;
		height: 100%;
		border-radius: 90rem;
	}

	.unit {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		position: absolute;
		border-radius: 90rem;
		will-change: opacity;
	}

	${mobile`
		position: absolute;
		bottom: var(--phone-padding);
		left: var(--phone-padding);
		width: calc(100% - var(--phone-padding) * 2);
	`}
`;

export const TemplatesCards = styled.div`
	perspective: 1rem;
	position: relative;
	padding-bottom: 56.25%;
`;

export const Card = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: absolute;
	border-radius: 3rem;
	border: 1px solid rgba(255, 255, 255, 0.3);
	transform-origin: center;
	transform-style: preserve-3d;
	backface-visibility: hidden;
	will-change: transform, opacity;

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

export const CardImageWrapper = styled(a.div)`
	width: 100%;
	height: 100%;
	will-change: transform;
`;
