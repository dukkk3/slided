import { schemaHelper, clientHelper } from "@core/helpers";

export const layout = {
	...schemaHelper.generateStoreSchema({
		scrollEnabled: false,
		feedbackOpened: false,
		breakpoint: clientHelper.detectBreakpoint(),
	}),
	promo: schemaHelper.generateStoreSchema({
		sequenceOpeningAnimationEnded: false,
		promoBannerOpeningAnimationEnded: false,
		loaderHidden: true,
		videoLoaded: true,
		interactiveEnabled: function () {
			return this.sequenceOpeningAnimationEnded && this.promoBannerOpeningAnimationEnded;
		},
	}),
};
