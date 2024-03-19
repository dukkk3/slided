import compose from "compose-function";
import { restore } from "effector";

// eslint-disable-next-line no-restricted-imports
import { MAX_ITERATION_NUMBER } from "@pages/main-page/main-page.config";
// eslint-disable-next-line no-restricted-imports
import { $interactiveEnabled, toProgressRunned, progress } from "@pages/main-page/main-page.model";

import { withScrollSync } from "./with-scroll-sync";
import { withStyles } from "./with-styles";
import { withTheme } from "./with-theme";

// eslint-disable-next-line effector/enforce-store-naming-convention
export const withProviders = (Component: React.FC) =>
	compose(
		withScrollSync({
			progress,
			iterationFactor: 4,
			iterationsCount: MAX_ITERATION_NUMBER,
			$toProgressRunned: restore(toProgressRunned, null),
			$enabled: $interactiveEnabled,
		}),
		withStyles,
		withTheme
	)(Component);
