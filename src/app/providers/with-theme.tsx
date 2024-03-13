import { ThemeProvider } from "styled-components";

import { theme } from "../styled/theme";

export const withTheme = (Component: React.FC) => (props: any) =>
	(
		<ThemeProvider theme={theme}>
			<Component {...props} />
		</ThemeProvider>
	);
