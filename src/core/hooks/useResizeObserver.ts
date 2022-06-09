import React, { useCallback, useEffect, useMemo } from "react";
import ResizeObserver from "resize-observer-polyfill";

import { useLocalStore, useSpareRef } from "@core/hooks";

interface Options {
	ref?: React.RefObject<any>;
	calculateSizeWithPaddings?: boolean;
}

type Position = { top: number; left: number; right: number; bottom: number };
type Size = { width: number; height: number };

export function useResizeObserver({ ref, calculateSizeWithPaddings = false }: Options = {}) {
	const spareRef = useSpareRef(ref);
	const localStore = useLocalStore({
		DOMRect: { width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 },
	} as { DOMRect: Size & Position });

	const resizeObserverCallback = useCallback(
		(entries: ResizeObserverEntry[]) => {
			const entry = entries[0];

			if (entry) {
				const DOMRect = !calculateSizeWithPaddings
					? entry.contentRect
					: entry.target.getBoundingClientRect();

				const position: Position = {
					top: DOMRect.top || 0,
					left: DOMRect.left || 0,
					bottom: DOMRect.bottom || 0,
					right: DOMRect.right || 0,
				};
				const size: Size = {
					width: DOMRect.width || 0,
					height: DOMRect.height || 0,
				};

				localStore.setDOMRect({ ...size, ...position });
			}
		},
		[calculateSizeWithPaddings, localStore]
	);

	const resizeObserver = useMemo(
		() => new ResizeObserver(resizeObserverCallback),
		[resizeObserverCallback]
	);

	const getSize = useCallback((): Size => {
		return {
			width: localStore.DOMRect.width,
			height: localStore.DOMRect.height,
		};
	}, [localStore]);

	const getPosition = useCallback((): Position => {
		return {
			top: localStore.DOMRect.top,
			bottom: localStore.DOMRect.bottom,
			left: localStore.DOMRect.left,
			right: localStore.DOMRect.right,
		};
	}, [localStore]);

	useEffect(() => {
		const targetElement = spareRef.current;

		if (targetElement) {
			resizeObserver.observe(targetElement);
		}

		return () => {
			if (targetElement) {
				resizeObserver.unobserve(targetElement);
			}

			resizeObserver.disconnect();
		};
	}, [resizeObserver, spareRef]);

	return { ref: spareRef, getSize, getPosition };
}
