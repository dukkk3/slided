import React, { useRef } from "react";

export function useSpareRef<T>(ref?: React.RefObject<T>) {
	const spareRef = useRef<T>(null);
	return ref || spareRef;
}
