import { useMemo } from "react";
import { useLocation } from "react-router";

export function useQueryParam(param: string) {
	const location = useLocation();
	return useMemo(() => new URLSearchParams(location.search).get(param), [location, param]);
}
