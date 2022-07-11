import { useCallback } from "react";

import { useGlobalStore } from "./useGlobalStore";
import { breakpoints, BreakpointNameKind } from "@core/helpers/device.helper";
import { useLocalStore } from "./useLocalStore";

const breakpointsKeys = Object.keys(breakpoints) as BreakpointNameKind[];

export function useBreakpoint() {
	const appStore = useGlobalStore((store) => store.app);

	const getMediaMatches = useCallback(() => {
		return appStore.mediaMatches;
	}, [appStore]);

	const getMediaMatch = useCallback(
		(key: BreakpointNameKind) => {
			return getMediaMatches()[key];
		},
		[getMediaMatches]
	);

	const range = useCallback(
		(a: BreakpointNameKind, b?: BreakpointNameKind) => {
			const aIndex = breakpointsKeys.indexOf(a);

			if (!b) return breakpointsKeys.slice(aIndex).some(getMediaMatch);

			const bIndex = breakpointsKeys.indexOf(b);
			return breakpointsKeys.slice(aIndex, bIndex).some(getMediaMatch);
		},
		[getMediaMatch]
	);

	const localStore = useLocalStore({
		get mobile() {
			return range("mobile", "tablet");
		},
		get tablet() {
			return range("tablet", "laptop");
		},
		get laptop() {
			return range("laptop");
		},
		get identified() {
			return Object.values(getMediaMatches()).some(Boolean);
		},
	});

	const mobile = useCallback(() => {
		return localStore.mobile;
	}, [localStore]);

	const tablet = useCallback(() => {
		return localStore.tablet;
	}, [localStore]);

	const laptop = useCallback(() => {
		return localStore.laptop;
	}, [localStore]);

	const identified = useCallback(() => {
		return localStore.identified;
	}, [localStore]);

	return {
		getMediaMatches,
		getMediaMatch,
		identified,
		laptop,
		mobile,
		tablet,
		range,
	};
}
