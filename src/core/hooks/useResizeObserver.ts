import { useCallback, useMemo, useRef } from "react";
import { transaction } from "mobx";
import ResizeObserver from "resize-observer-polyfill";

import { useLocalStore } from "./useLocalStore";
import { useEventListener } from "./useEventListener";
import { debounce as debounceHof } from "@core/utils/common.utils";
import { getOffset as getOffsetImpl } from "@core/utils/dom.utils";

export interface Options {
	calculateSizeWithPaddings?: boolean;
	windowResizeDebounce?: number;
	withOffset?: boolean;
	debounce?: number;
}

export type Offset = { top: number; left: number };
export type Size = { width: number; height: number };

export function useResizeObserver({
	debounce,
	withOffset = true,
	windowResizeDebounce = 100,
	calculateSizeWithPaddings = false,
}: Options = {}) {
	const prevTargetRef = useRef<HTMLElement | null>(null);
	const localStore = useLocalStore({
		size: { width: 0, height: 0 } as Size,
		offset: { top: 0, left: 0 } as Offset,
		ready: false,
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
				localStore.setReady(true);
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

	const windowResizeCallback = useCallback(() => {
		const target = prevTargetRef.current;
		localStore.setReady(false);
		if (!target) {
			return;
		}
		updateStore(target);
	}, [localStore, updateStore]);

	const preparedResizeObserverCallback = useMemo(() => {
		switch (true) {
			case Number(debounce) > 0:
				return debounceHof(resizeObserverCallback, debounce as number);
			default:
				return resizeObserverCallback;
		}
	}, [debounce, resizeObserverCallback]);

	const preparedWindowResizeCallback = useMemo(() => {
		switch (true) {
			case Number(windowResizeDebounce) > 0:
				return debounceHof(windowResizeCallback, windowResizeDebounce as number);
			default:
				return windowResizeCallback;
		}
	}, [windowResizeCallback, windowResizeDebounce]);

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

	const ready = useCallback(() => {
		return localStore.ready;
	}, [localStore]);

	useEventListener(window, "resize", preparedWindowResizeCallback);

	return { ref: handleRef, getSize, getOffset, ready };
}
