import { schemaHelper, clientHelper } from "@core/helpers";

export const layout = {
	...schemaHelper.generateStoreSchema({
		scrollEnabled: false,
		dampingScrollEnabled: false,
		breakpoint: clientHelper.detectBreakpoint(),
		feedbackOpened: false,
	}),
	promo: schemaHelper.generateStoreSchema({
		sequenceOpeningAnimationEnded: false,
		promoBannerOpeningAnimationEnded: false,
		interactiveEnabled: function () {
			return this.sequenceOpeningAnimationEnded && this.promoBannerOpeningAnimationEnded;
		},
	}),
};
