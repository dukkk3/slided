import { css } from "styled-components";

import { FontNameKind, FontStylesKind, getFontSourceByName } from "@assets/fonts";

interface FontConfig {
	name: string;
}

const ttCommonsConfig = fontConfigFactor("TTCommons");

function fontConfigFactor<T extends FontNameKind>(name: T) {
	const getFontSource = (style: FontStylesKind<T>) => getFontSourceByName(name, style);

	return (
		callback: (
			getFontSource: (style: FontStylesKind<T>) => any
		) => Omit<FontFaceFactoryOptions, "name">
	) => {
		return fontFaceFactory({ ...callback(getFontSource), name });
	};
}

interface FontFaceFactoryOptions extends FontConfig {
	sources: Record<string, string>;
	weight?: string | number;
	style?: string;
}

function fontFaceFactory({
	name,
	sources,
	weight = 600,
	style = "normal",
}: FontFaceFactoryOptions) {
	return css`
		@font-face {
			font-display: swap;
			font-style: normal;
			font-weight: ${weight};
			font-family: "${name}";
			font-style: ${style};
			src: ${Object.entries(sources)
				.map(([format, source]) => `url(${source}) format("${format}")`)
				.join(",")};
		}
	`;
}

export const fontsStyle = css`
	${ttCommonsConfig((getFontSource) => ({
		weight: 100,
		sources: {
			truetype: getFontSource("Thin"),
		},
	}))}
	${ttCommonsConfig((getFontSource) => ({
		weight: 200,
		sources: {
			truetype: getFontSource("ExtraLight"),
		},
	}))}
	${ttCommonsConfig((getFontSource) => ({
		weight: 300,
		sources: {
			truetype: getFontSource("Light"),
		},
	}))}
	${ttCommonsConfig((getFontSource) => ({
		weight: 400,
		sources: {
			truetype: getFontSource("Regular"),
		},
	}))}
	${ttCommonsConfig((getFontSource) => ({
		weight: 500,
		sources: {
			truetype: getFontSource("Medium"),
		},
	}))}
	${ttCommonsConfig((getFontSource) => ({
		weight: 600,
		sources: {
			truetype: getFontSource("DemiBold"),
		},
	}))}
	${ttCommonsConfig((getFontSource) => ({
		weight: 700,
		sources: {
			truetype: getFontSource("Bold"),
		},
	}))}
	${ttCommonsConfig((getFontSource) => ({
		weight: 800,
		sources: {
			truetype: getFontSource("ExtraBold"),
		},
	}))}
	${ttCommonsConfig((getFontSource) => ({
		weight: 900,
		sources: {
			truetype: getFontSource("Black"),
		},
	}))}
`;
