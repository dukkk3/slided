import { a } from "react-spring";
import styled from "styled-components";

import { Image } from "@components/common/ui/Image/styled";

export const PhoneLayer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
`;

export const Container = styled.div`
	top: 0;
	z-index: 0;
	width: 34rem;
	height: 90%;
	position: absolute;
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
	background: rgba(255, 255, 255, 0.5);
	-webkit-mask-image: -webkit-radial-gradient(white, black);

	${Image} {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		position: absolute;

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
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
`;

export const AssistantFaceContainer = styled.div`
	width: 10rem;
	height: 10rem;
	margin: 5rem auto 0;
`;

export const Description = styled.div`
	font-size: 2.8rem;
	font-weight: 700;
	text-align: center;
	margin-top: 2.8rem;
	line-height: 100%;
	position: relative;
	width: 100%;
	color: black;
`;

export const CardsWrapper = styled.div`
	margin: 0 auto;
	perspective: 1rem;
	position: relative;
	padding-bottom: 50%;
	width: calc(100% - 5rem);
	margin-top: 2.4rem;
`;

export const Card = styled(a.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	/* background: yellow; */
	position: absolute;
	border-radius: 3rem;
	border: 1px solid white;
	transform-origin: center;
	transform-style: preserve-3d;

	${Image} {
		width: 100%;
		height: 100%;

		img {
			object-fit: cover;
		}
	}
`;
