import { createContext } from "react";
import { useLocalObservable } from "mobx-react-lite";

import * as segments from "./segments";

export type Store = typeof segments;

export const combinedStore = { ...segments };

export const storeContext = createContext(combinedStore);
export function StoreProvider({ children }: { children: React.ReactNode }) {
	const store = useLocalObservable(() => combinedStore);
	return <storeContext.Provider value={store}>{children}</storeContext.Provider>;
}
