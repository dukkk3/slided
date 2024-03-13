import "styled-components";

import type { Theme } from "./app/styled/theme";

declare module "styled-components" {
	export interface DefaultTheme extends Theme {}
}
