import { schemaHelper, clientHelper } from "@core/helpers";

export const layout = {
	...schemaHelper.generateStoreSchema({
		scrollEnabled: false,
		dampingScrollEnabled: false,
		breakpoint: clientHelper.detectBreakpoint(),
	}),
	promo: schemaHelper.generateStoreSchema({
		sequenceOpeningAnimationEnded: false,
		promoBannerOpeningAnimationEnded: false,
		endPointFaceContainerSize: { width: 0, height: 0 },
		endPointFaceOffset: { top: 0, left: 0 },
	}),
};
