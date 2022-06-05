import styled from "styled-components";

import { descriptionMixin } from "@styles";

export const Assistant = styled.div`
	visibility: hidden;
	display: flex;
	width: 100%;
	flex-direction: column;
	align-items: center;
	text-align: center;
`;

export const FaceWrapper = styled.div`
	width: 15rem;
	height: 15rem;
	visibility: visible;
`;

export const DescriptionWrapper = styled.div`
	visibility: visible;
	position: relative;
	margin-top: 2.8rem;
	font-size: 3.2rem;
	width: 100%;
	${descriptionMixin}
`;
