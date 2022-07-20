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

export const mediaQueries = {
	mobile: "(max-device-width: 927px) and (-webkit-max-device-pixel-ratio: 3)",
	tablet:
		"(max-width: 1280px) and (min-resolution: 169dpi), (max-width: 1024px), (max-device-width: 1024px)",
	desktop: "(min-device-width: 1200px)",
};

// export const mediaQueries = Object.entries({
// 	...media,
// 	...mediaIos,
// 	iPhoneX:
// 		"@media only screen and (min-device-width : 0px) and (max-device-width : 927px) and (-webkit-max-device-pixel-ratio : 4) and (-webkit-min-device-pixel-ratio:1)",
// 	iPhone13:
// 		"@media only screen and (min-device-width: 428px) and (max-device-height: 927px) and (-webkit-min-device-pixel-ratio: 3)",
// }).reduce(
// 	(acc, [key, query]) => ({ ...acc, [key]: query.replace(/^@media only screen and[ ]?/, "") }),
// 	{} as typeof media & typeof mediaIos & Record<"iPhoneX" | "iPhone13", string>
// );

export type MediaQueries = typeof mediaQueries;
export type MediaQueryKeyKind = keyof MediaQueries;
