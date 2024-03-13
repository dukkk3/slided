import { createGlobalStyle } from "styled-components";

import { commonStyles } from "./common.styles";
import { fontsStyles } from "./fonts.styles";

export const GlobalStyle = createGlobalStyle`
   ${commonStyles}
   ${fontsStyles}
`;
