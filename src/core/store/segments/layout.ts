import { schemaHelper, clientHelper } from "@core/helpers";

export const layout = {
	...schemaHelper.generateStoreSchema({
		scrollEnabled: false,
		feedbackOpened: false,
		breakpoint: clientHelper.detectBreakpoint(),
	}),
	promo: schemaHelper.generateStoreSchema({
		sequenceOpeningAnimationEnded: true,
		promoBannerOpeningAnimationEnded: false,
		interactiveEnabled: function () {
			return this.sequenceOpeningAnimationEnded && this.promoBannerOpeningAnimationEnded;
		},
	}),
};
