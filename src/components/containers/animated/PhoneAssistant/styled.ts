import { a } from "react-spring";
import styled from "styled-components";

import { Button } from "@components/common/ui/Button/styled";

export { Description, DescriptionWrapper } from "@components/promo/PhoneCard/styled";

export const Face = styled.div`
	width: 10rem;
	height: 10rem;
	margin: 5rem auto 0;
	position: relative;
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
`;

export const Slide = styled.div`
	width: 100%;
	height: 100%;
	border-radius: inherit;
	background: radial-gradient(100% 87.77% at 100% 0%, #acb3bf 0%, #dddee1 100%);
`;

export const SlideContent = styled(a.div)`
	width: calc(100% - var(--height));
	height: 100%;
	position: relative;
	will-change: transform;

	&:after {
		top: 1rem;
		left: 1rem;
		content: "";
		width: calc(var(--height) - 2rem);
		height: calc(var(--height) - 2rem);
		position: absolute;
		border-radius: 50%;
		background: ${(props) => props.theme.color.primary};
	}
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

	> * {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		cursor: default;
		border-radius: 90rem;
		position: absolute;
		will-change: opacity;
	}
`;

interface PulseCircleProps {
	$theme?: "green" | "white";
}

export const PulseCircle = styled(a.div)<PulseCircleProps>`
	top: calc(50% - var(--size) / 2);
	left: calc(50% - var(--size) / 2);
	position: absolute;
	width: var(--size);
	height: var(--size);
	border-radius: 50%;
	background: ${(props) =>
		props.$theme === "white"
			? "rgba(255, 255, 255, .05)"
			: `radial-gradient(
		50.94% 50.94% at 50% 50%,
		rgba(200, 255, 0, 0) 26.74%,
		rgba(200, 255, 0, 0) 39.24%,
		#c8ff00 100%
	)`};
	will-change: transform;

	--size: max(150vh, 150vw);
`;
