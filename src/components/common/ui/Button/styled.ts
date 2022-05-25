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

function getButtonSize(sizeKey: SizeKind, theme: DefaultTheme) {
	return generateButtonSize(theme)[sizeKey];
}

export type SizeKind = keyof ReturnType<typeof generateButtonSize>;

interface ButtonProps {
	$size: SizeKind;
}

export const Button = styled.button<ButtonProps>`
	background: ${(props) => props.theme.color.primary};
	padding: ${(props) => getButtonSize(props.$size, props.theme).padding};
	font-size: ${(props) => getButtonSize(props.$size, props.theme).fontSize};
	border-radius: 0.5rem;
	text-align: center;
	font-weight: 700;
	color: black;
`;
