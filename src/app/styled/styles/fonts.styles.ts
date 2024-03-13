import { css } from "styled-components";

import { fonts } from "../assets";

const TTCommons = fontConfigFactor("TTCommons");

export const fontsStyles = css`
	html,
	body {
		font-family: "TTCommons", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
			Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
	}

	${TTCommons((getFontSource) => ({
		weight: 100,
		sources: {
			opentype: getFontSource("thin"),
		},
	}))}
	${TTCommons((getFontSource) => ({
		weight: 200,
		sources: {
			opentype: getFontSource("extraLight"),
		},
	}))}
	${TTCommons((getFontSource) => ({
		weight: 300,
		sources: {
			opentype: getFontSource("light"),
		},
	}))}
	${TTCommons((getFontSource) => ({
		weight: 400,
		sources: {
			opentype: getFontSource("regular"),
		},
	}))}
	${TTCommons((getFontSource) => ({
		weight: 500,
		sources: {
			opentype: getFontSource("medium"),
		},
	}))}
	${TTCommons((getFontSource) => ({
		weight: 600,
		sources: {
			opentype: getFontSource("semiBold"),
		},
	}))}
	${TTCommons((getFontSource) => ({
		weight: 700,
		sources: {
			opentype: getFontSource("bold"),
		},
	}))}
	${TTCommons((getFontSource) => ({
		weight: 800,
		sources: {
			opentype: getFontSource("extraBold"),
		},
	}))}
`;

type FontName = keyof typeof fonts;
type FontStyle<Name extends FontName> = keyof (typeof fonts)[Name];

function fontConfigFactor<T extends FontName>(name: T) {
	const getFontSource = (style: FontStyle<T>) => fonts[name][style];

	return (
		callback: (getFontSource: (style: FontStyle<T>) => any) => Omit<FontFaceFactoryOptions, "name">
	) => {
		return fontFaceFactory({ ...callback(getFontSource), name });
	};
}

interface FontConfig {
	name: string;
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
