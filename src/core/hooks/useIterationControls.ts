import { useContext } from "react";

import { context } from "@components/common/hoc/IterationControls";

export function useIterationControls() {
	return useContext(context);
}
