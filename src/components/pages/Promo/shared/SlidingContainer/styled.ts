import styled from "styled-components";

export const SlidingContainer = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	position: absolute;
	/* visibility: hidden; */
	overflow: hidden auto;
`;

export const Content = styled.div`
	/* padding: 4rem 0; */
	background: black;
	position: relative;
	border-radius: 3rem 3rem 0 0;
	margin-top: var(--header-height);
	min-height: calc(100% - var(--header-height));
`;

export const CloseIconGroup = styled.button`
	top: 2rem;
	opacity: 0.6;
	fill: white;
	width: var(--size);
	height: var(--size);
	position: absolute;
	right: var(--container-gap);
	transition: opacity 0.3s ease;

	--size: 2.4rem;

	&:hover {
		opacity: 1;
	}
`;
