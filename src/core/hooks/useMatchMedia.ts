import { useCallback, useLayoutEffect, useMemo } from "react";

import { useLocalStore } from "./useLocalStore";

export type Matches<T extends object> = { [K in keyof T]: boolean };

export function useMatchMedia<T extends Record<string, string>>(queries: T) {
	const keys = useMemo(() => Object.keys(queries) as (keyof T)[], [queries]);
	const defaultMatches = useMemo(
		() => keys.reduce((acc, key) => ({ ...acc, [key]: false }), {} as Matches<T>),
		[keys]
	);
	const mediaQueryList = useMemo(
		() => keys.map((key) => window.matchMedia(queries[key])),
		[keys, queries]
	);
	const localStore = useLocalStore({
		matches: defaultMatches,
		updateMatches: function (matches: Matches<T>) {
			this.matches = { ...this.matches, ...matches };
		},
	});

	const getMatches = useCallback(() => {
		return mediaQueryList.reduce(
			(acc, mql, index) => ({ ...acc, [keys[index]]: mql.matches }),
			{} as Matches<T>
		);
	}, [keys, mediaQueryList]);

	const getValue = useCallback(
		(key: keyof T) => {
			return localStore.matches[key] || false;
		},
		[localStore]
	);

	const getValues = useCallback(() => {
		return localStore.matches;
	}, [localStore]);

	const handleChange = useCallback(() => {
		localStore.updateMatches(getMatches());
	}, [getMatches, localStore]);

	useLayoutEffect(() => {
		mediaQueryList.forEach((mql) => mql.addEventListener("change", handleChange));
		return () => mediaQueryList.forEach((mql) => mql.removeEventListener("change", handleChange));
	}, [getMatches, handleChange, mediaQueryList]);

	useLayoutEffect(() => {
		handleChange();
	}, [handleChange]);

	return {
		getValue,
		getValues,
		update: handleChange,
	};
}
