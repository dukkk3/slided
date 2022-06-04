import styled from "styled-components";

export const Promo = styled.div`
	width: 100%;
	display: flex;
	text-align: center;
	visibility: hidden;
	justify-content: center;

	> * {
		visibility: visible;
	}
`;

export const TitleWrapper = styled.div`
	font-size: 7.4rem;
	font-weight: 600;
	line-height: 75%;
`;

export const SubtitleWrapper = styled.div`
	font-weight: 600;
	font-size: 2rem;
	margin-top: 1.4rem;
`;

export const Head = styled.div`
	margin-bottom: 4.4rem;
	margin-top: 6.5rem;
`;
