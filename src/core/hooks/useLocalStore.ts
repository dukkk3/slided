import { useLocalObservable } from "mobx-react-lite";

import { storeSchemaFactory, Store } from "@core/helpers/factories/schema.factory.helper";

export function useLocalStore<T extends Store.Base>(schema: T) {
	return useLocalObservable(() => storeSchemaFactory(schema));
}
