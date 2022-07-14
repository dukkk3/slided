import { useEffect } from "react";
import { reaction } from "mobx";

import { Promo } from "@components/pages/Promo";

import { useGlobalStore } from "@core/hooks/useGlobalStore";
import { useMatchMedia } from "@core/hooks/useMatchMedia";
import { breakpoints, getMatchMediaQuery, BreakpointNameKind } from "@core/helpers/device.helper";

const breakpointsKeys = Object.keys(breakpoints) as BreakpointNameKind[];
const mediaQueries: Record<BreakpointNameKind, string> = breakpointsKeys.reduce(
	(acc, breakpointName, index) => ({
		...acc,
		[breakpointName]:
			index === breakpointsKeys.length - 1
				? getMatchMediaQuery(breakpointName, "min")
				: getMatchMediaQuery([breakpointName, breakpointsKeys[index + 1]]),
	}),
	{} as Record<BreakpointNameKind, string>
);

export const App: React.FC = () => {
	const matchMedia = useMatchMedia(mediaQueries);
	const orientationMatchMedia = useMatchMedia({
		landscape: "(orientation: landscape)",
		portrait: "(orientation: portrait)",
	});

	const appStore = useGlobalStore((store) => store.app);

	useEffect(
		() =>
			reaction(
				() => matchMedia.getValues(),
				(values) => appStore.setMediaMatches(values)
			),
		[appStore, matchMedia]
	);

	useEffect(
		() =>
			reaction(
				() => orientationMatchMedia.getValues(),
				(values) =>
					appStore.setOrientation(values.landscape ? "landscape" : values.portrait ? "portrait" : null)
			),
		[appStore, orientationMatchMedia]
	);

	useEffect(() => {
		matchMedia.update();
		orientationMatchMedia.update();
		window.scrollTo(0, 0);
	}, [matchMedia, orientationMatchMedia]);

	return <Promo />;
};
