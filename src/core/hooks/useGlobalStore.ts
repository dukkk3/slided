import { useContext } from "react";

import { storeContext, Store } from "@core/store";

export function useGlobalStore<T>(selector: (store: Store) => T): T;
export function useGlobalStore(): Store;

export function useGlobalStore(selector?: any) {
	const store = useContext(storeContext);
	return selector ? selector(store) : store;
}
