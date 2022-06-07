export function useMultipleHooks<T extends (...args: any) => any>(
	hook: T,
	...params: Parameters<T>[]
): ReturnType<T>[] {
	return params.map((param) => hook(...param));
}
