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

export const Mouse = styled.div`
	width: 24px;
	height: 46px;
	padding: 2px;
	position: relative;
	border-radius: 90rem;
	border: 2px solid black;

	&:after {
		content: "";
		top: 8px;
		width: 4px;
		height: 4px;
		display: block;
		background: black;
		border-radius: 50%;
		position: absolute;
		left: calc(50% - 2px);
		animation: ${scrollKeyframes} 1s infinite both;
	}
`;
