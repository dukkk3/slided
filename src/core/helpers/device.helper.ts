const os = [
	{ name: "windows", searchTemplate: "Win" },
	{ name: "mac", searchTemplate: "Mac" },
	{ name: "android", searchTemplate: "Android" },
	{ name: "ios", searchTemplate: "like Mac" },
] as const;

export type OsNameKind = typeof os[number]["name"];

export function getOsName() {
	return os.reduce(
		(acc, data) => (navigator.userAgent.indexOf(data.searchTemplate) > -1 ? data.name : acc),
		os[0].name as OsNameKind
	);
}

export const breakpoints = {
	mobile: 0,
	"mobile.m": 375,
	"mobile.l": 425,
	tablet: 768,
	laptop: 1024,
	"laptop.l": 1440,
};

export type BreakpointNameKind = keyof typeof breakpoints;
export type MatchMediaQueryOperatorType = "min" | "max" | "equal";

export function getMatchMediaQuery(
	range: BreakpointNameKind,
	type: MatchMediaQueryOperatorType,
	offset?: number
): string;
export function getMatchMediaQuery(range: [BreakpointNameKind, BreakpointNameKind]): string;

export function getMatchMediaQuery(
	range: any,
	type?: MatchMediaQueryOperatorType,
	offset: number = 0
) {
	if (Array.isArray(range))
		return [getMatchMediaQuery(range[0], "min"), getMatchMediaQuery(range[1], "max", -0.01)].join(
			" and "
		);

	const breakpointName = range as BreakpointNameKind;

	switch (type) {
		case "min":
			return `(min-width: ${Math.max(breakpoints[breakpointName] + offset, 0)}px)`;
		case "max":
			return `(max-width: ${Math.max(breakpoints[breakpointName] + offset, 0)}px)`;
		case "equal":
			return [
				getMatchMediaQuery(breakpointName, "min", -0.01),
				getMatchMediaQuery(breakpointName, "max", 0.01),
			].join(" and ");
	}

	return "";
}
