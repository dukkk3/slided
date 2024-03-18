import styled, { css } from "styled-components";

export type Size = "s" | "m";
export type Variant = "primary" | "dark" | "grey";

const buttonSizes: Record<Size, any> = {
	s: css`
		padding: 12px 18px 10px;
		font-size: 16px;
	`,
	m: css`
		padding: 16px 30px 14px;
		font-size: 18px;
	`,
};

const buttonVariants: Record<Variant, any> = {
	primary: css`
		color: ${({ theme }) => theme.color.accent.secondary};
		background: ${({ theme }) => theme.color.accent.primary};
	`,
	dark: css`
		color: white;
		background: ${({ theme }) => theme.color.accent.secondary};
	`,
	grey: css`
		color: ${({ theme }) => theme.color.accent.secondary};
		background: radial-gradient(100% 267.77% at 100% 0%, #acb3bf 0%, #dddee1 100%);
	`,
};

interface ButtonProps {
	$size: Size;
	$variant: Variant;
}

export const Button = styled.button<ButtonProps>`
	text-align: center;
	border-radius: 6px;
	font-weight: 600;
	cursor: pointer;
	border: none;
	transition: background 0.3s ease, transform 0.3s ease;
	${({ $size }) => buttonSizes[$size]}
	${({ $variant }) => buttonVariants[$variant]}

	&:not(:disabled) {
		&:hover {
			background: #bef200;
		}

		&:active {
			transform: translateY(0.4rem);
		}
	}
`;
