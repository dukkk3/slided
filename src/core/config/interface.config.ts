export const breakpoints = {
	mobile: 0,
	"mobile.m": 375,
	"mobile.l": 425,
	tablet: 768,
	laptop: 1024,
	"laptop.l": 1440,
};

export type BreakpointsKind = keyof typeof breakpoints;
