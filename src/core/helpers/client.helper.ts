import { interfaceConfig } from "@core/config";

const breakpointsEntries = Object.entries(interfaceConfig.breakpoints);
const sortedBreakpointsEntries = breakpointsEntries.sort(([, a], [, b]) => b - a) as [
	interfaceConfig.BreakpointsKind,
	number
][];

export function detectBreakpoint() {
	const windowWidth = window.innerWidth || 0;
	return sortedBreakpointsEntries.reduce((acc, [name, deviceWidth]) => {
		if ((acc as any) === "" && windowWidth >= deviceWidth) {
			return name;
		}

		return acc;
	}, "" as interfaceConfig.BreakpointsKind);
}

export function detectOperationSystemName() {
	const navigator = window.navigator;
	let name: "windows" | "mac" | "linux" | "android" | "ios" | "" = "";

	if (navigator.userAgent.indexOf("Win") !== -1) {
		name = "windows";
	}

	if (navigator.userAgent.indexOf("Mac") !== -1) {
		name = "mac";
	}

	if (navigator.userAgent.indexOf("Android") !== -1) {
		name = "android";
	}

	if (navigator.userAgent.indexOf("like Mac") !== -1) {
		name = "ios";
	}

	return name;
}
