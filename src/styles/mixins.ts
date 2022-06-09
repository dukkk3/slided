import { css } from "styled-components";

export const verticalCenterMixin = css`
	top: 50%;
	position: absolute;
	transform: translateY(-50%);
`;

export function generateOutsideBorderMixin(borderSize: string) {
	return css`
		width: calc(100% + ${borderSize} * 2);
		height: calc(100% + ${borderSize} * 2);
		position: absolute;
		border-radius: 50%;
		left: -${borderSize};
		top: -${borderSize};
		border: ${borderSize} solid white;
	`;
}
