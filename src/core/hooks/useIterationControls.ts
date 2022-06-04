import { useContext } from "react";

import { context } from "@components/common/hoc/ScrollControls";

export function useIterationControls() {
	return useContext(context);
}
