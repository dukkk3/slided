import { schemaHelper, clientHelper } from "@core/helpers";

export const layout = {
	...schemaHelper.generateStoreSchema({
		scrollEnabled: false,
		feedbackOpened: false,
		breakpoint: clientHelper.detectBreakpoint(),
	}),
	promo: schemaHelper.generateStoreSchema({
		backgroundType: null as "frame" | "sequence" | null,
		promoBannerOpeningAnimationEnded: false,
		sequenceOpeningAnimationEnded: false,
		sequenceLoaded: false,
		loaderHidden: false,
		sequenceProgress: 0,
		sequenceFrame: 0,
		get canShowContent() {
			return (this.sequenceLoaded && this.loaderHidden) || this.backgroundType === "frame";
		},
		get interactiveEnabled() {
			return (
				(this.sequenceOpeningAnimationEnded || this.backgroundType === "frame") &&
				this.promoBannerOpeningAnimationEnded
			);
		},
	}),
};
