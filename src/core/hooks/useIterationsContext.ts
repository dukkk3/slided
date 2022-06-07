import { useContext } from "react";

import { context } from "@components/common/hoc/IterationControls";

export function useIterationsContext() {
	return useContext(context);
}
