import { useCallback, useEffect, useMemo, useRef } from "react";
import { transaction } from "mobx";
import ResizeObserver from "resize-observer-polyfill";

import { useDebounce } from "./useDebounce";
import { useLocalStore } from "./useLocalStore";
import { debounce as debounceHof, throttle as throttleHof } from "@core/utils/common.utils";
import { getOffset as getOffsetImpl } from "@core/utils/dom.utils";

export interface Options {
	calculateSizeWithPaddings?: boolean;
	withOffset?: boolean;
	debounce?: number;
	throttle?: number;
}

export type Offset = { top: number; left: number };
export type Size = { width: number; height: number };

export function useResizeObserver({
	debounce,
	throttle,
	withOffset = true,
	calculateSizeWithPaddings = false,
}: Options = {}) {
	const prevTargetRef = useRef<HTMLElement | null>(null);
	const localStore = useLocalStore({
		size: { width: 0, height: 0 } as Size,
		offset: { top: 0, left: 0 } as Offset,
	});

	const updateStore = useCallback(
		(entry: ResizeObserverEntry | Element) => {
			const target = "contentRect" in entry ? entry.target : entry;
			const { width, height } =
				!calculateSizeWithPaddings && "contentRect" in entry
					? entry.contentRect
					: target.getBoundingClientRect();
			const offset = withOffset ? getOffsetImpl(target as any) : { top: 0, left: 0 };
			transaction(() => {
				localStore.setSize({ width, height });
				localStore.setOffset(offset);
			});
		},
		[calculateSizeWithPaddings, localStore, withOffset]
	);

	const resizeObserverCallback = useCallback(
		(entries: ResizeObserverEntry[]) => {
			const entry = entries[0];

			if (entry) {
				updateStore(entry);
			}
		},
		[updateStore]
	);

	const preparedResizeObserverCallback = useMemo(() => {
		switch (true) {
			case Number(debounce) > 0:
				return debounceHof(resizeObserverCallback, debounce as number);
			case Number(throttle) > 0:
				return throttleHof(resizeObserverCallback, throttle as number);
			default:
				return resizeObserverCallback;
		}
	}, [debounce, resizeObserverCallback, throttle]);

	const resizeObserver = useMemo(
		() => new ResizeObserver(preparedResizeObserverCallback),
		[preparedResizeObserverCallback]
	);

	const getSize = useCallback(() => {
		return localStore.size;
	}, [localStore]);

	const getOffset = useCallback(() => {
		return localStore.offset;
	}, [localStore]);

	const handleWindowResize = useDebounce(() => {
		const target = prevTargetRef.current;
		if (!target) return;
		updateStore(target);
	}, debounce || 100);

	const handleRef = useCallback(
		(element: HTMLElement | null) => {
			if (element) {
				resizeObserver.observe(element);
			}

			if (prevTargetRef.current) {
				resizeObserver.unobserve(prevTargetRef.current);
			}

			prevTargetRef.current = element;
		},
		[resizeObserver]
	);

	useEffect(() => {
		window.addEventListener("resize", handleWindowResize);
		return () => window.removeEventListener("resize", handleWindowResize);
	}, [handleWindowResize]);

	return { ref: handleRef, getSize, getOffset };
}
