import { css } from "styled-components";

export const commonStyles = css`
	body {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}

	.border-radius-overflow-bugfix {
		-webkit-mask-image: -webkit-radial-gradient(white, black);
	}
`;
