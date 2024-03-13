import { Normalize } from "styled-normalize";

import { GlobalStyle } from "../styled/styles";

export const withStyles = (Component: React.FC) => (props: any) =>
	(
		<>
			<Normalize />
			<GlobalStyle />
			<Component {...props} />
		</>
	);
