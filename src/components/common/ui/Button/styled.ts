import styled, { DefaultTheme } from "styled-components";

function generateButtonSize(theme: DefaultTheme) {
	return {
		s: {
			padding: "1.2rem 1.8rem 1rem",
			fontSize: "1.6rem",
		},
		m: {
			padding: "2rem 3.2rem 1.8rem",
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
	font-weight: 700;
`;
