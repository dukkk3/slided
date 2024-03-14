import styled from "styled-components";

import { styledMixin } from "@shared/styled";

import { TextAnimation } from "../../text-animation";

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

export const Description = styled(TextAnimation)`
	${styledMixin.textMixin}
	top: 0;
	text-align: center;
	position: absolute;
	transform: translateX(-50%);
`;
