import { a } from "react-spring";
import styled, { css } from "styled-components";
import { descriptionMixin } from "@styles";

import { Image } from "@components/common/ui/Image/styled";

interface ContainerProps {
	$hidden?: boolean;
}

export const Container = styled.div<ContainerProps>`
	width: 100%;
	max-height: 100%;
	height: fit-content;
	position: relative;
	overflow: ${(props) => props.$hidden && "hidden"};
`;

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

		/* transform: scale(1.2);
    	mix-blend-mode: overlay;
    	opacity: .2; */

		img {
			/* object-position: 20% center; */
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
	/* position: relative; */
`;

export const DescriptionWrapper = styled.div`
	position: relative;
	margin-top: 2.8rem;
	font-size: 2.8rem;
	width: 100%;
	${descriptionMixin}
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
`;

interface PhoneCardProps {
	$alternative?: boolean;
}

export const PhoneCard = styled.div<PhoneCardProps>`
	top: 0;
	height: 100%;
	display: flex;
	width: 34rem;
	position: absolute;
	justify-content: center;
	left: calc(50% - 34rem / 2);

	${(props) =>
		props.$alternative &&
		css`
			${DescriptionWrapper} {
				margin: 4rem 0;

				${Description} {
					top: 0 !important;
				}
			}
		`}
`;
