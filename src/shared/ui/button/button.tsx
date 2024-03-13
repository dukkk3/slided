import { memo } from "react";

import { AssignComponentProps } from "../assign-component-props";

import * as S from "./button.styled";

export interface ButtonProps extends React.ComponentProps<"button"> {
	size?: S.Size;
	variant?: S.Variant;
	children?: React.ReactNode;
}

export const Button = AssignComponentProps(
	memo(({ children, type = "button", size = "s", variant = "primary", ...rest }: ButtonProps) => {
		return (
			<S.Button {...rest} type={type} $variant={variant} $size={size}>
				{children}
			</S.Button>
		);
	}),
	{ S }
);
