import { animated } from "@react-spring/web";
import styled from "styled-components";

export const Word = styled(animated.span)`
	white-space: pre;
	display: inline-block;
`;

export const RowWrapper = styled.p`
	margin: 0;
	display: block;
	overflow: hidden;
	white-space: pre;
`;
