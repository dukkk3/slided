import { css } from "styled-components";

export const generateOutsideBorderMixin = (borderSize: string) => {
	return css`
		width: calc(100% + ${borderSize} * 2);
		height: calc(100% + ${borderSize} * 2);
		position: absolute;
		border-radius: 50%;
		left: -${borderSize};
		top: -${borderSize};
		border: ${borderSize} solid white;
	`;
};

export const textMixin = css`
	color: black;
	font-size: 32px;
	font-weight: 600;
	line-height: 100%;
`;

export const fixedSize = (size: string, rectProp: "height" | "width" = "width") => css`
   flex: 0 0 ${size};
   ${rectProp}: ${size};
   min-${rectProp}: ${size};
`;

export const square = (size: string) => css`
	${fixedSize(size, "width")}
	${fixedSize(size, "height")}
`;
