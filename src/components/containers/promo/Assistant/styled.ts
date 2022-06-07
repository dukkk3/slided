import styled from "styled-components";

import { descriptionMixin } from "@styles";

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
	width: 15rem;
	height: 15rem;
	flex: 0 0 15rem;
`;

export const DescriptionWrapper = styled.div`
	position: relative;
	margin-top: 2.8rem;
	font-size: 3.2rem;
	height: 1px;
	width: 100%;
	${descriptionMixin}
`;

interface DescriptionProps {
	$overlay?: boolean;
}

export const Description = styled.div<DescriptionProps>`
	top: 0;
	left: 0;
	width: 100%;
	position: ${(props) => props.$overlay && "absolute"};
`;
