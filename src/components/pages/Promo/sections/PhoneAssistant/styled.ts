import { a } from "react-spring";
import styled from "styled-components";

import { Button } from "@components/common/ui/Button/styled";
import { Image } from "@components/common/ui/Image/styled";

import { mobile } from "@styles/breakpoint";

import {
	Phone,
	Description,
	Content as PhoneContent,
	ContentWrapper as PhoneContentWrapper,
} from "../../shared/Phone/styled";

export { Description, DescriptionGroup } from "../../shared/Phone/styled";

export const PhoneGroup = styled(a.div)`
	${Phone} {
		height: 70rem;
		max-height: 100%;

		${PhoneContent}, ${PhoneContentWrapper} {
			height: 100%;
		}

		${Description} {
			top: 0 !important;
		}
	}
`;

export const Face = styled.div`
	width: 10rem;
	height: 10rem;
	margin: 0 auto;
	position: relative;
`;

export const Content = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding-top: calc(var(--phone-padding) * 2);
	height: 100%;
`;

export const FaceWrapper = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
`;

export const CardsGroup = styled.div`
	position: relative;
`;

export const RayImageGroup = styled(a.div)`
	width: 100%;
	top: -3rem;
	display: flex;
	align-items: center;
	height: 100%;
	position: absolute;
	justify-content: center;

	${Image} {
		height: calc(100% - 8rem);
		max-height: 14rem;

		${mobile`
			height: calc(100% - 4rem);
		`}
	}
`;

export const Cards = styled(a.div)`
	margin: 2rem 0;
	will-change: transform, opacity;

	${mobile`
		margin: 2.4rem 0;
	`}
`;

export const ButtonWrapper = styled.div`
	width: 100%;
	position: relative;
	height: var(--height);
	flex: 0 0 var(--height);

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
