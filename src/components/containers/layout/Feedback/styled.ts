import styled from "styled-components";

import { Content as ContentImpl } from "@components/common/ordinary/FullScreenContainerLayout/styled";
import { Button } from "@components/common/ui/Button/styled";

export const Feedback = styled.div`
	width: 100%;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 9999;

	${ContentImpl} {
		background: black;
		border-radius: 3rem 3rem 0 0;
	}
`;

export const Content = styled.div`
	display: flex;
	padding: 4rem 0;
	flex-direction: column;
	justify-content: space-between;
	min-height: calc(100vh - var(--header-height));
`;

export const Head = styled.div`
	margin: 6rem 0;
`;

export const Title = styled.p`
	font-weight: 600;
	font-size: 8rem;
	text-align: center;
	color: white;
`;

export const Form = styled.form`
	width: 37rem;
	margin: 8rem auto;

	${Button} {
		width: 100%;
		margin-top: 6rem;
	}
`;

export const Input = styled.input`
	border-bottom: 1px solid white;
	text-align: center;
	font-weight: 600;
	font-size: 3.2rem;
	padding: 1rem 0;
	color: white;
	width: 100%;

	&::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}
`;

export const InputGroup = styled.div`
	${Input}:not(:nth-child(1)) {
		margin-top: 4rem;
	}
`;
