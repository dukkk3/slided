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
		faceStyles: {
			top: 0,
			left: 0,
			width: 0,
			height: 0,
		},
		minFaceStyles: {
			top: 0,
			left: 0,
			width: 0,
			height: 0,
		},
		executorFaceStyles: {
			top: 0,
			left: 0,
			width: 0,
			height: 0,
		},
		minFaceWithExecutorStyles: {
			top: 0,
			left: 0,
			width: 0,
			height: 0,
		},
		interactiveEnabled: function () {
			return this.sequenceOpeningAnimationEnded && this.promoBannerOpeningAnimationEnded;
		},
	}),
};
