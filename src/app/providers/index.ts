import compose from "compose-function";

import { withStyles } from "./with-styles";
import { withTheme } from "./with-theme";

// eslint-disable-next-line effector/enforce-store-naming-convention
export const withProviders = (Component: React.FC) => compose(withStyles, withTheme)(Component);
