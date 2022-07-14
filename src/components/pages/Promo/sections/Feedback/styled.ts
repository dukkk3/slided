import styled from "styled-components";

import { Button } from "@components/common/ui/Button/styled";

import { mobile } from "@styles/breakpoint";

export const Feedback = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	z-index: 9999;
	position: absolute;
`;

export const Content = styled.div`
	display: flex;
	padding: 4rem 0;
	flex-direction: column;
	justify-content: space-between;
	min-height: calc(100vh - var(--header-height));

	${mobile`
		justify-content: initial;
	`}
`;

export const Head = styled.div`
	margin: 6rem 0;

	${mobile`
		margin-top: 6rem 0;
	`}
`;

export const Title = styled.p`
	font-weight: 600;
	font-size: 8rem;
	text-align: center;
	color: white;

	${mobile`
		font-weight: 600;
		font-size: 4.2rem;
		line-height: 140%;
	`}
`;

export const Form = styled.form`
	width: 37rem;
	margin: 8rem auto;

	${Button} {
		width: 100%;
		margin-top: 6rem;
	}

	${mobile`
		width: 100%;
		margin: 6rem auto;

		${Button} {
			margin-top: 4rem;
		}
	`}
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

	${mobile`
		font-size: 2.2rem;
	`}
`;

export const InputGroup = styled.div`
	${Input}:not(:nth-child(1)) {
		margin-top: 4rem;
	}
`;
