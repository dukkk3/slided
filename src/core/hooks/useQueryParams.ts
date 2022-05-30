import { useMemo } from "react";
import { useLocation } from "react-router";

export function useQueryParams() {
	const location = useLocation();
	return useMemo(() => new URLSearchParams(location.search), [location]);
}
