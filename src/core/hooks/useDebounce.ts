import { useCallback, useEffect, useRef } from "react";

import { debounce } from "@core/utils/common.utils";

export function useDebounce<T extends any[]>(
	callback: (...args: T) => void,
	time: number,
	dependencies: any[] = []
) {
	const debouncedCallbackRef = useRef<any>(null);

	const callCallback = useCallback(
		(...args: T) => {
			const debouncedCallback = debouncedCallbackRef.current;

			if (debouncedCallback) {
				debouncedCallback(...args);
			} else {
				callback(...args);
			}
		},
		[callback]
	);

	useEffect(() => {
		debouncedCallbackRef.current = debounce(callback, time);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...dependencies, callback]);

	return callCallback;
}
