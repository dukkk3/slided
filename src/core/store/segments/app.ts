import { schemaHelper, clientHelper } from "@core/helpers";

export const app = schemaHelper.generateStoreSchema({
	osName: clientHelper.detectOperationSystemName(),
});
