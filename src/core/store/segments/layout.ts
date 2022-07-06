import { storeSchemaFactory } from "@core/helpers/factories/schema.factory.helper";

export const layout = {
	...storeSchemaFactory({
		scrollEnabled: false,
		feedbackOpened: false,
	}),
	promo: storeSchemaFactory({
		wasMounted: false,
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
