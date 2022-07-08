import { useContext } from "react";

import { context } from "@components/common/hoc/IterationsControls/index2";

export function useIterationsContext() {
	return useContext(context);
}
