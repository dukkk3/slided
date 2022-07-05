import { ThemedCssFunction, DefaultTheme, css } from "styled-components";

import {
	getMatchMediaQuery,
	BreakpointNameKind,
	MatchMediaQueryOperatorType,
} from "@core/helpers/device.helper";

export function breakpoint(
	a: BreakpointNameKind,
	type: MatchMediaQueryOperatorType
): ThemedCssFunction<DefaultTheme>;
export function breakpoint(
	range: [BreakpointNameKind, BreakpointNameKind]
): ThemedCssFunction<DefaultTheme>;

export function breakpoint(...args: any[]) {
	const media = getMatchMediaQuery(...(args as Parameters<typeof getMatchMediaQuery>));
	return (...args: any[]) => css`
		@media ${media} {
			${css(...(args as Parameters<typeof css>))}
		}
	`;
}

export const mobile = breakpoint(["mobile", "tablet"]);
export const tablet = breakpoint(["tablet", "laptop"]);
export const laptop = breakpoint("laptop", "min");
