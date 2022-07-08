import { useCallback } from "react";

import { useEventListener } from "./useEventListener";

export function useHotkey(key: KeyNameKind, callback: (event: KeyboardEvent) => void) {
	const handleDocumentKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === key) {
				callback(event);
			}
		},
		[callback, key]
	);

	useEventListener(document, "keydown", handleDocumentKeyDown);
}

export type KeyNameKind =
	| "0"
	| "1"
	| "2"
	| "3"
	| "4"
	| "5"
	| "6"
	| "7"
	| "8"
	| "9"
	| "-"
	| "+"
	| "Tab"
	| "Escape"
	| "CapsLock"
	| "Shift"
	| "Control"
	| "Alt"
	| "Meta"
	| " "
	| "ArrowLeft"
	| "ArrowDown"
	| "ArrowUp"
	| "ArrowRight";
