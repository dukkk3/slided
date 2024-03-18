import { interpolators } from "@shared/helpers";
import type { Range } from "@shared/types";

import * as config from "../../main-page.config";
import * as model from "../../main-page.model";

const { ITERATIONS_CHAIN } = config;
export const { progress, $progress, toIterationRunned } = model;

export const ITERATIONS_CHAIN_WITH_PAYLOAD = ITERATIONS_CHAIN.map((item) => {
	const range: Range = [item.from, item.to];
	const $iterationProgress = $progress.map(interpolators.toRanged(...range));
	const $focused = $progress.map(interpolators.toInRange(...range));
	const $status = $iterationProgress.map((progress) => progress >= 1);

	return {
		...item,
		range,
		$progress: $iterationProgress,
		$focused,
		$status,
	};
});
