import { useContext } from "react";

import { context } from "@components/common/hoc/IterationsControls";

export function useIterationsControls() {
	return useContext(context);
}
