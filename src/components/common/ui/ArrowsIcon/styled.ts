import styled, { keyframes } from "styled-components";

export const ArrowsIcon = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const iconAnimation = keyframes`
   from {
      transform: translateX(0);
      /* opacity: 1; */
   }
   to {
      transform: translateX(-1rem);
      /* opacity: 0; */
   }
`;

export const IconGroup = styled.div`
	width: var(--size);
	height: var(--size);
	flex: 0 0 var(--size);
	fill: black;

	--size: 2.4rem;

	&:nth-child(2) {
		margin-left: 1rem;
		transform: rotate(180deg);

		svg {
			animation-delay: 2s;
		}
	}

	svg {
		animation: ${iconAnimation} 2s ease infinite alternate-reverse;
	}
`;
