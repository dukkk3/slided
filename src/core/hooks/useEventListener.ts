import { useEffect } from "react";

export function useEventListener<T extends keyof GlobalEventHandlersEventMap>(
	target: Element | Document | Window,
	event: T,
	listener: (event: GlobalEventHandlersEventMap[T]) => any
) {
	useEffect(() => {
		// @ts-ignore
		target.addEventListener(event, listener);

		return () => {
			// @ts-ignore
			target.removeEventListener(event, listener);
		};
	}, [event, listener, target]);
}
