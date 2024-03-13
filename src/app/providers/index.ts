import compose from "compose-function";

import { withStyles } from "./with-styles";
import { withTheme } from "./with-theme";

export const withProviders = (Component: React.FC) => compose(withStyles, withTheme)(Component);
