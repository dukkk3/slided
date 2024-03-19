import { animated } from "@react-spring/web";
import styled from "styled-components";

import { Image } from "@shared/ui";

import { SlideDots as _SlideDots, Loader as _Loader, IterationContainer } from "./ui";

export const Loader = styled(animated(_Loader))`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 9999;
	position: fixed;
	background: white;
	position: absolute;
`;

export const MainPage = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	position: sticky;
	padding-bottom: 20px;
	flex-direction: column;
	box-sizing: border-box;
`;

export const Overlay = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
	display: flex;
	flex-direction: column;
`;

const Constraints = styled(animated.div)`
	padding: 0 40px;
`;

export const FlowContent = styled.div`
	top: 0;
	left: 0;
	position: fixed;
	pointer-events: none;
`;

export const Header = styled(Constraints)`
	display: flex;
	padding-top: 20px;
	align-items: center;
	padding-bottom: 20px;
	justify-content: space-between;
`;

export const Navigation = styled.div`
	gap: 10px;
	display: flex;
	align-items: center;
`;

export const NavigationItem = styled.p`
	margin: 0;
	cursor: pointer;
	padding: 4px 6px;
	font-weight: 600;
	text-decoration: underline;

	&:hover {
		text-decoration: none;
	}
`;

export const Logo = styled(Image)`
	max-height: 50px;
`;

export const Content = styled(animated.main)`
	width: 100%;
	height: 100%;
	position: relative;
	box-sizing: border-box;

	${IterationContainer.S.IterationsContainer} {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding-top: 0;
		padding: 20px 40px;
		position: absolute;
		box-sizing: border-box;

		${IterationContainer.S.Content} {
			height: 100%;
		}
	}
`;

export const BackgroundWrapper = styled(animated.div)`
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
	z-index: 999;
	background: black;
`;

export const SlideDots = styled(animated(_SlideDots))`
	top: 50%;
	right: 40px;
	z-index: 999;
	position: absolute;
	transform: translateY(-50%);
`;
