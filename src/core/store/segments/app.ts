import { BreakpointNameKind, getOsName } from "@core/helpers/device.helper";
import { storeSchemaFactory } from "@core/helpers/factories/schema.factory.helper";

export const app = {
	os: storeSchemaFactory({
		name: getOsName(),
	}),
	...storeSchemaFactory({
		mediaMatches: {} as Record<BreakpointNameKind, boolean>,
	}),
};
