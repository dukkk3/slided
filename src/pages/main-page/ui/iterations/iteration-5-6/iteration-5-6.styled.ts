import { animated } from "@react-spring/web";
import styled, { css } from "styled-components";

import { styledMixin } from "@shared/styled";

export const Pulses = styled.div`
	/* mix-blend-mode: multiply; */
	pointer-events: none;
`;

type PulseVariant = "green" | "white";

const pulseVariants: Record<PulseVariant, any> = {
	green: css`
		/* mix-blend-mode: multiply; */
		background: radial-gradient(
			50.94% 50.94% at 50% 50%,
			rgba(200, 255, 0, 0) 26.74%,
			rgba(200, 255, 0, 0) 39.24%,
			#c8ff00 100%
		);
	`,
	white: css`
		background: rgba(255, 255, 255, 0.14);
	`,
};

export const Circle = styled(animated.div)<{ $variant: PulseVariant }>`
	z-index: 0;
	position: absolute;
	border-radius: 50%;
	pointer-events: none;
	top: calc(50% - var(--size) / 2);
	left: calc(50% - var(--size) / 2);
	${styledMixin.square("var(--size)")}
	${({ $variant }) => pulseVariants[$variant]}

	--size: max(150vh, 150vw);
`;
