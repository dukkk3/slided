import styled from "styled-components";

import { breakpoint } from "@styles/breakpoint";

export const Promo = styled.div`
	width: 100%;
	height: 1px;
	display: flex;
	position: absolute;
	text-align: center;
	flex-direction: column;

	${breakpoint("mobile", "tablet")`
		height: 100%;
		justify-content: center;
	`}
`;

export const TitleWrapper = styled.div`
	font-size: 7.4rem;
	font-weight: 600;
	line-height: 75%;

	${breakpoint("mobile", "tablet")`
		font-size: 4.4rem;
		font-weight: 700;
		line-height: 85%;
	`}
`;

export const SubtitleWrapper = styled.div`
	font-weight: 600;
	font-size: 2rem;
	margin-top: 1.4rem;

	${breakpoint("mobile", "tablet")`
		font-size: 1.8rem;
		margin-top: 1.2rem;
	`}
`;

export const Head = styled.div`
	margin-bottom: 4.4rem;
	margin-top: 6.5rem;

	${breakpoint("mobile", "tablet")`
		margin-top: 0;
	`}
`;
