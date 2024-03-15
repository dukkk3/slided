import compose from "compose-function";

// eslint-disable-next-line no-restricted-imports
import { MAX_ITERATION_NUMBER } from "@pages/main-page/main-page.config";
// eslint-disable-next-line no-restricted-imports
import { progress } from "@pages/main-page/main-page.model";

import { withScrollSync } from "./with-scroll-sync";
import { withStyles } from "./with-styles";
import { withTheme } from "./with-theme";

export const withProviders = (Component: React.FC) =>
	compose(
		withScrollSync({ progress, iterationsCount: MAX_ITERATION_NUMBER }),
		withStyles,
		withTheme
	)(Component);
