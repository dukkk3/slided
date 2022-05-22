import * as TTCommons from "./TTCommons";

export const fonts = {
	TTCommons,
};

type Fonts = typeof fonts;

export type FontNameKind = keyof Fonts;
export type FontStylesKind<T extends FontNameKind> = keyof Fonts[T];

export function getFontSourceByName<T extends FontNameKind>(name: T, style: FontStylesKind<T>) {
	return fonts[name][style];
}

export function getFontStylesSourcesByName<T extends FontNameKind>(name: T) {
	return fonts[name];
}

export function getTypeSafeFontName(name: FontNameKind) {
	return name;
}
