import { a } from "react-spring";
import styled from "styled-components";

import { Image } from "@components/common/ui/Image/styled";
import { Button } from "@components/common/ui/Button/styled";

export const Phone = styled.div`
	width: 100%;
	display: flex;
	height: 100%;
	visibility: hidden;
	justify-content: center;
`;

interface ContainerProps {
	$hidden?: boolean;
}

export const Container = styled.div<ContainerProps>`
	top: 0;
	z-index: 0;
	width: 34rem;
	max-height: 100%;
	overflow: ${(props) => props.$hidden && "hidden"};
	position: absolute;
	visibility: visible;
`;

export const Plug = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
	overflow: hidden;
	visibility: visible;
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

export const Content = styled.div`
	width: 100%;
	padding: 2.5rem;
	padding-top: 0;
	position: relative;
`;

export const AssistantFaceGroup = styled.div`
	width: 10rem;
	height: 10rem;
	margin: 5rem auto 0;
	position: relative;
`;

export const AssistantFaceContainer = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
`;

export const Description = styled.div`
	font-size: 2.8rem;
	font-weight: 700;
	text-align: center;
	line-height: 100%;
	position: relative;
	width: 100%;
	color: black;
`;

export const DescriptionOverlayContent = styled.div`
	top: 3.6rem;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
`;

export const DescriptionOverlayContentBig = styled.div`
	top: 3.4rem;
	left: 0;
	width: 100%;
	line-height: 70%;
	font-size: 4.8rem;
	position: absolute;
`;

export const ButtonWrapper = styled(a.div)`
	will-change: transform opacity;

	${Button} {
		width: 100%;
		border-radius: 90rem;
	}
`;
