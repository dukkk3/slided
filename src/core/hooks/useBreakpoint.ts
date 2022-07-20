import { useCallback } from "react";

import { useGlobalStore } from "./useGlobalStore";
import { useLocalStore } from "./useLocalStore";
import { MediaQueryKeyKind } from "@core/helpers/device.helper";

export function useBreakpoint() {
	const appStore = useGlobalStore((store) => store.app);

	const getMediaMatches = useCallback(() => {
		return appStore.media.matches;
	}, [appStore]);

	const getMediaMatch = useCallback(
		(key: MediaQueryKeyKind) => {
			return getMediaMatches()[key];
		},
		[getMediaMatches]
	);

	const some = useCallback(
		(...keys: MediaQueryKeyKind[]) => {
			return keys.some(getMediaMatch);
		},
		[getMediaMatch]
	);

	const localStore = useLocalStore({
		get mobile() {
			return some("mobile");
		},
		get tablet() {
			return !this.mobile && some("tablet");
		},
		get desktop() {
			return !this.tablet && some("desktop");
		},
		get identified() {
			return Object.values(getMediaMatches()).some(Boolean);
		},
		get landscape() {
			return appStore.media.orientation === "landscape";
		},
		get portrait() {
			return appStore.media.orientation === "portrait";
		},
	});

	const mobile = useCallback(() => {
		return localStore.mobile;
	}, [localStore]);

	const tablet = useCallback(() => {
		return localStore.tablet;
	}, [localStore]);

	const desktop = useCallback(() => {
		return localStore.desktop;
	}, [localStore]);

	const identified = useCallback(() => {
		return localStore.identified;
	}, [localStore]);

	const landscape = useCallback(() => {
		return localStore.landscape;
	}, [localStore]);

	const portrait = useCallback(() => {
		return localStore.portrait;
	}, [localStore]);

	return {
		getMediaMatches,
		getMediaMatch,
		identified,
		landscape,
		portrait,
		desktop,
		mobile,
		tablet,
	};
}
