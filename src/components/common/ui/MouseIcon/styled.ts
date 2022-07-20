import styled, { keyframes } from "styled-components";

const scrollKeyframes = keyframes`
   0% {
      opacity: 1;
      transform: translateY(0px);
   }

   100% {
      opacity: 0;
      transform: translateY(1.4rem);
   }
`;

export const MouseIcon = styled.div`
	width: 2.4rem;
	height: 4.6rem;
	padding: 0.2rem;
	position: relative;
	border-radius: 90rem;
	border: 2px solid black;

	&:after {
		content: "";
		width: 0.4rem;
		height: 0.4rem;
		display: block;
		background: black;
		border-radius: 50%;
		position: absolute;
		top: 0.8rem;
		left: calc(50% - 0.2rem);
		animation: ${scrollKeyframes} 1s infinite both;
	}
`;
