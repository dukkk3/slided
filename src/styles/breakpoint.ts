import { css } from "styled-components";
import { mediaQueries, MediaQueryKeyKind } from "@core/helpers/device.helper";

export function breakpoint(breakpoint: MediaQueryKeyKind) {
	return (...args: any[]) => css`
		@media ${mediaQueries[breakpoint]} {
			${css(...(args as Parameters<typeof css>))}
		}
	`;
}

export const mobile = breakpoint("mobile");
export const tablet = breakpoint("tablet");
export const desktop = breakpoint("desktop");
