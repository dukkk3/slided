import { a } from "react-spring";
import styled from "styled-components";

export const LandscapePlug = styled.div`
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	position: fixed;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	background: radial-gradient(58.04% 476.05% at -22.44% 0%, #bdc7d0 3.83%, #dce1e9 100%);
	z-index: 9998;
`;

export const SmileGroup = styled(a.div)`
	width: 10rem;
	height: 10rem;
`;

export const Description = styled.p`
	font-size: 4.2rem;
	font-weight: 600;
	margin-top: 2.4rem;
	line-height: 110%;
	text-align: center;
`;
