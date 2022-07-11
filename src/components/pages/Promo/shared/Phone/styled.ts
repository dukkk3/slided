import { a } from "react-spring";
import styled, { css } from "styled-components";

import { Image } from "@components/common/ui/Image/styled";

import { descriptionMixin } from "@styles";
import { mobile, tablet } from "@styles/breakpoint";

export const Plug = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
	overflow: hidden;
	border-radius: 3rem;
	border: 1px solid rgba(255, 255, 255, 0.3);
	background: linear-gradient(
		165.14deg,
		rgba(220, 223, 230, 0.75) 0%,
		rgba(255, 255, 255, 0.375) 100%
	);
	will-change: transform opacity;

	&:after {
		left: 0;
		top: -20%;
		content: "";
		z-index: 0;
		width: 100%;
		height: 140%;
		position: absolute;
		transform: translateY(15%) rotate(45deg);
		transform-origin: center;
		background: linear-gradient(
			96.46deg,
			rgba(255, 255, 255, 0.06) 4.78%,
			rgba(255, 255, 255, 0.12) 98.5%
		);
	}
`;

export const PlugImageWrapper = styled(a.div)`
	top: 0;
	left: 0;
	z-index: 0;
	height: 100%;
	width: max-content;
	position: absolute;
	mix-blend-mode: overlay;
	will-change: transform opacity;

	${Image} {
		width: 100%;
		height: 100%;

		img {
			object-fit: cover;
		}
	}
`;

export const ContentWrapper = styled.div`
	width: 100%;
	padding: var(--phone-padding);
	padding-top: 0;

	--phone-padding: 2.5rem;
`;

export const Content = styled.div`
	width: 100%;
`;

export const DescriptionGroup = styled.div`
	position: relative;
	margin-top: 2.8rem;
	font-size: 2.8rem;
	width: 100%;
	${descriptionMixin}

	${mobile`
		font-size: 3.2rem;
		line-height: 90%;
	`}
`;

interface DescriptionProps {
	$big?: boolean;
	$overlay?: boolean;
}

export const Description = styled.div<DescriptionProps>`
	left: 0;
	width: 100%;
	top: ${(props) => props.$overlay && "3.4rem"};
	font-size: ${(props) => props.$big && "4.8rem"};
	line-height: ${(props) => props.$big && "70%"};
	position: ${(props) => props.$overlay && "absolute"};

	${mobile`
		top: ${(props: DescriptionProps) => props.$overlay && 0};
		font-size: inherit;
		line-height: inherit;
	`}
`;

interface PhoneProps {
	$alternative?: boolean;
	$hidden?: boolean;
}

const PHONE_WIDTH = "35rem";

export const Phone = styled.div<PhoneProps>`
	top: 0;
	position: absolute;
	width: ${PHONE_WIDTH};
	left: calc(50% - ${PHONE_WIDTH} / 2);
	max-height: ${(props) => props.$hidden && "100%"};
	overflow: ${(props) => props.$hidden && "hidden"};

	${(props) =>
		props.$alternative &&
		css`
			${DescriptionGroup} {
				margin: 4rem 0;

				${Description} {
					top: 0 !important;
				}
			}
		`}

	${mobile`
		left: 0;
		width: 100%;
		height: 100%;
		max-height: 100%;
	`}

	${tablet`
		top: 50%;
		transform: translateY(-50%);
	`}
`;
