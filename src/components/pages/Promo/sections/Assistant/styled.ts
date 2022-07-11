import styled from "styled-components";

import { descriptionMixin } from "@styles";
import { mobile } from "@styles/breakpoint";

export const Assistant = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 1px;
	display: flex;
	position: absolute;
	text-align: center;
	align-items: center;
	flex-direction: column;
`;

export const FaceWrapper = styled.div`
	width: var(--size);
	height: var(--size);
	flex: 0 0 var(--size);

	--size: 15rem;

	${mobile`
		margin-top: 4rem;

		--size: 10rem;
	`}
`;

export const DescriptionWrapper = styled.div`
	position: relative;
	margin-top: 2.8rem;
	font-size: 3.2rem;
	height: 1px;
	width: 100%;
	${descriptionMixin}

	${mobile`
		font-size: 3.2rem;
		line-height: 90%;
	`}
`;

export const Description = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	position: absolute;
`;
