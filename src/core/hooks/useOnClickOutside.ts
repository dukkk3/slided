import React, { useEffect, useCallback } from "react";

export function useOnClickOutside(
	ref: React.RefObject<any>,
	handler: (event: MouseEvent | TouchEvent) => void
) {
	const handleDocumentClick = useCallback(
		(event: TouchEvent | MouseEvent) => {
			if (!ref.current || ref.current.contains(event.target)) {
				return;
			}

			handler(event);
		},
		[handler, ref]
	);

	useEffect(() => {
		document.addEventListener("mousedown", handleDocumentClick);
		document.addEventListener("touchstart", handleDocumentClick);
		return () => {
			document.removeEventListener("mousedown", handleDocumentClick);
			document.removeEventListener("touchstart", handleDocumentClick);
		};
	}, [handleDocumentClick]);
}
