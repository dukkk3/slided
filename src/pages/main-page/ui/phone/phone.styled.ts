import { animated } from "@react-spring/web";
import styled, { css } from "styled-components";

import { Image } from "@shared/ui";

export const Background = styled(animated.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
	overflow: hidden;
	border-radius: 30px;
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

export const BackgroundImageWrapper = styled(animated.div)`
	top: 0;
	left: 0;
	z-index: 0;
	height: 100%;
	width: max-content;
	position: absolute;
	mix-blend-mode: overlay;
	will-change: transform opacity;

	${Image.S.Picture} {
		width: 100%;
		height: 100%;

		${Image.S.Image} {
			object-fit: cover;
		}
	}
`;

export const ContentWrapper = styled.div`
	width: 100%;
	height: 100%;
	padding: 24px;
	padding-top: 0;
	box-sizing: border-box;
`;

export const Content = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
`;

export const DescriptionGroup = styled.div`
	position: relative;
	margin-top: 28px;
	font-size: 28px;
	width: 100%;
`;

interface DescriptionProps {
	$big?: boolean;
	$overlay?: boolean;
}

export const Description = styled.div<DescriptionProps>`
	left: 0;
	width: 100%;
	top: ${(props) => props.$overlay && "3.4rem"};
	font-size: ${(props) => props.$big && "4.2rem"};
	line-height: ${(props) => props.$big && "70%"};
	position: ${(props) => props.$overlay && "absolute"};
`;

const PHONE_WIDTH = "350px";

export const Phone = styled.div<{ $alternative?: boolean; $hidden?: boolean }>`
	top: 0;
	position: absolute;
	width: ${PHONE_WIDTH};
	left: calc(50% - ${PHONE_WIDTH} / 2);
	max-height: ${({ $hidden }) => $hidden && "100%"};
	overflow: ${({ $hidden }) => $hidden && "hidden"};

	${({ $alternative }) =>
		$alternative &&
		css`
			${DescriptionGroup} {
				margin: 4rem 0;

				${Description} {
					top: 0 !important;
				}
			}
		`}
`;
