import { useCallback, useEffect, useRef } from "react";

import { throttle } from "@core/utils/common.utils";

export function useThrottle<T extends any[]>(
	callback: (...args: T) => void,
	time: number,
	dependencies: any[] = []
) {
	const throttledCallbackRef = useRef<any>(null);

	const callCallback = useCallback(
		(...args: T) => {
			const throttledCallback = throttledCallbackRef.current;

			if (throttledCallback) {
				throttledCallback(...args);
			} else {
				callback(...args);
			}
		},
		[callback]
	);

	useEffect(() => {
		throttledCallbackRef.current = throttle(callback, time);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...dependencies, callback]);

	return callCallback;
}
