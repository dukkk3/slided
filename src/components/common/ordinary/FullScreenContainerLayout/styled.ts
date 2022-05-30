import styled from "styled-components";

export const FullScreenContainerLayout = styled.div`
	height: 100%;
	overflow: hidden auto;
`;

export const Content = styled.div`
	margin-top: var(--header-height);
	min-height: calc(100% - var(--header-height));
`;
