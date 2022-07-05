import styled from "styled-components";

import { mobile } from "@styles/breakpoint";

export const Promo = styled.div`
	width: 100%;
	height: 1px;
	display: flex;
	position: absolute;
	text-align: center;
	flex-direction: column;

	${mobile`
		margin-top: 4rem;
		// height: 100%;
		// justify-content: center;
	`}
`;

export const TitleWrapper = styled.div`
	font-size: 7.4rem;
	font-weight: 600;
	line-height: 75%;

	${mobile`
		font-size: 4.4rem;
		line-height: 85%;
	`}
`;

export const SubtitleWrapper = styled.div`
	font-weight: 600;
	font-size: 2rem;
	margin-top: 1.4rem;

	${mobile`
		font-size: 1.8rem;
		margin-top: 1.2rem;
	`}
`;

export const Head = styled.div`
	margin-bottom: 4.4rem;
	margin-top: 6.5rem;

	${mobile`
		margin-top: 0;
	`}
`;
