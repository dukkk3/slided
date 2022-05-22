import { useCallback } from "react";

import { useGlobalStore } from "@core/hooks";
import { interfaceConfig } from "@core/config";

const breakpointsKeys = Object.keys(
	interfaceConfig.breakpoints
) as interfaceConfig.BreakpointsKind[];

export function useBreakpoint() {
	const layoutStore = useGlobalStore((store) => store.layout);

	const range = useCallback(
		(a: interfaceConfig.BreakpointsKind, b?: interfaceConfig.BreakpointsKind) => {
			const currentBreakpointIndex = breakpointsKeys.indexOf(layoutStore.breakpoint);
			const aBreakpointIndex = breakpointsKeys.indexOf(a);

			if (!b) {
				return aBreakpointIndex <= currentBreakpointIndex;
			}

			const bBreakpointIndex = breakpointsKeys.indexOf(b);

			return aBreakpointIndex <= currentBreakpointIndex && currentBreakpointIndex <= bBreakpointIndex;
		},
		[layoutStore]
	);

	const getBreakpoint = useCallback(() => {
		return layoutStore.breakpoint;
	}, [layoutStore]);

	const mobile = useCallback(() => {
		return range("mobile", "mobile.l");
	}, [range]);

	const tablet = useCallback(() => {
		return range("tablet");
	}, [range]);

	const desktop = useCallback(() => {
		return range("laptop");
	}, [range]);

	return { mobile, tablet, desktop, range, getBreakpoint };
}
