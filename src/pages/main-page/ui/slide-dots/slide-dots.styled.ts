import { animated } from "@react-spring/web";
import styled from "styled-components";

import { styledMixin } from "@shared/styled";

export const SlideDots = styled.div`
	gap: 18px;
	display: flex;
	flex-direction: column;
`;

export const SlideDot = styled.div<{ $focused?: boolean; $status?: boolean }>`
	cursor: pointer;
	position: relative;
	${styledMixin.square("8px")}
	mix-blend-mode: multiply;

	&:after {
		content: "";
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		position: absolute;
		border-radius: 50%;
		transform: ${({ $status }) => $status && "scale(1.6)"};
		background: ${({ theme, $status, $focused }) =>
			$status || $focused ? theme.color.accent.primary : "black"};
		transition: transform 0.3s ease, background 0.3s ease;
	}
`;

const STROKE_INNER_OFFSET = "4px";

export const SlideDotStrokeWrapper = styled.svg`
	top: -${STROKE_INNER_OFFSET};
	left: -${STROKE_INNER_OFFSET};
	z-index: 1;
	width: calc(100% + ${STROKE_INNER_OFFSET} * 2);
	height: calc(100% + ${STROKE_INNER_OFFSET} * 2);
	position: absolute;
`;

export const SlideDotStroke = styled(animated.circle)`
	stroke-width: 2;
	stroke-linecap: round;
	transform-origin: center;
	transform: rotate(-90deg);
	fill: transparent;
	stroke: black;
	/* stroke: ${(props) => props.theme.color.accent.primary}; */
`;
