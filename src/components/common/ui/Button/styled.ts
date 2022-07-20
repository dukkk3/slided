import styled, { DefaultTheme } from "styled-components";

function generateButtonSize(theme: DefaultTheme) {
	return {
		s: {
			padding: "1.2rem 1.8rem 1rem",
			fontSize: "1.6rem",
		},
		m: {
			padding: "1.6rem 3rem 1.4rem",
			fontSize: "1.8rem",
		},
	};
}

function generateButtonTheme(theme: DefaultTheme) {
	return {
		primary: {
			color: "black",
			background: theme.color.primary,
		},
		dark: {
			color: "white",
			background: "black",
		},
		grey: {
			color: "black",
			background: "radial-gradient(100% 267.77% at 100% 0%, #ACB3BF 0%, #DDDEE1 100%)",
		},
	};
}

function getButtonSize(sizeKey: SizeKind, theme: DefaultTheme) {
	return generateButtonSize(theme)[sizeKey];
}

function getButtonTheme(themeKey: ThemeKind, theme: DefaultTheme) {
	return generateButtonTheme(theme)[themeKey];
}

export type SizeKind = keyof ReturnType<typeof generateButtonSize>;
export type ThemeKind = keyof ReturnType<typeof generateButtonTheme>;

interface ButtonProps {
	$size: SizeKind;
	$theme: ThemeKind;
}

export const Button = styled.button<ButtonProps>`
	background: ${(props) => getButtonTheme(props.$theme, props.theme).background};
	font-size: ${(props) => getButtonSize(props.$size, props.theme).fontSize};
	padding: ${(props) => getButtonSize(props.$size, props.theme).padding};
	color: ${(props) => getButtonTheme(props.$theme, props.theme).color};
	border-radius: 0.5rem;
	text-align: center;
	font-weight: 600;
	transition: background 0.3s ease, transform 0.3s ease;

	&:not(:disabled) {
		&:hover {
			background: #bef200;
		}

		&:active {
			transform: translateY(0.4rem);
		}
	}
`;
