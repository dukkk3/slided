import { getOsName, MediaQueryKeyKind } from "@core/helpers/device.helper";
import { storeSchemaFactory } from "@core/helpers/factories/schema.factory.helper";

export const app = {
	os: storeSchemaFactory({
		name: getOsName(),
	}),
	media: storeSchemaFactory({
		matches: {} as MediaMatches,
		orientation: null as "landscape" | "portrait" | null,
	}),
};

export type MediaMatches = Record<MediaQueryKeyKind, boolean>;
