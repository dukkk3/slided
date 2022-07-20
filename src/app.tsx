import { useEffect, useLayoutEffect } from "react";
import { reaction } from "mobx";

import { Promo } from "@components/pages/Promo";

import { useGlobalStore } from "@core/hooks/useGlobalStore";
import { useMatchMedia } from "@core/hooks/useMatchMedia";
import { mediaQueries } from "@core/helpers/device.helper";

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
				(values) => appStore.media.setMatches(values)
			),
		[appStore, matchMedia]
	);

	useEffect(
		() =>
			reaction(
				() => orientationMatchMedia.getValues(),
				(values) =>
					appStore.media.setOrientation(
						values.landscape ? "landscape" : values.portrait ? "portrait" : null
					)
			),
		[appStore, orientationMatchMedia]
	);

	useEffect(() => {
		matchMedia.update();
		orientationMatchMedia.update();
		window.scrollTo(0, 0);
	}, [matchMedia, orientationMatchMedia]);

	useLayoutEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return <Promo />;
};
