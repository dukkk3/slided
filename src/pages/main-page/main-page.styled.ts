import { animated } from "@react-spring/web";
import styled from "styled-components";

export const MainPage = styled.div`
	width: 100vw;
	height: 100vh;
	position: relative;
`;

export const Content = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
`;

export const BackgroundWrapper = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
`;

export const Debugger = styled(animated.p)`
	color: white;
	font-size: 20px;
`;

export const Buttons = styled.div`
	display: flex;
	padding: 0 10px;
	flex-direction: row;
	gap: 10px;
	position: absolute;
	bottom: 0;
	left: 0;
	z-index: 1;
	background: black;
`;
