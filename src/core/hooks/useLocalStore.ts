import { useLocalObservable } from "mobx-react-lite";

import { schemaHelper } from "@core/helpers";
import type { SchemaBase } from "@core/types";

export function useLocalStore<T extends SchemaBase.Store>(schema: T) {
	return useLocalObservable(() => schemaHelper.generateStoreSchema(schema));
}
