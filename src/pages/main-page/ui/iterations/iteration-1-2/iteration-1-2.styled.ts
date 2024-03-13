import styled from "styled-components";

import { styledMixin } from "@shared/styled";

export const AssistantSpeech = styled.div`
	top: 0;
	left: 0;
	gap: 28px;
	width: 100%;
	display: flex;
	position: absolute;
	text-align: center;
	align-items: center;
	flex-direction: column;
`;

export const AssistantWrapper = styled.div`
	${styledMixin.square("150px")}
`;

export const DescriptionWrapper = styled.div`
	position: relative;
`;

export const Description = styled.div`
	top: 0;
	color: black;
	font-size: 32px;
	line-height: 100%;
	font-weight: 600;
	text-align: center;
	position: absolute;
	transform: translateX(-50%);
`;
