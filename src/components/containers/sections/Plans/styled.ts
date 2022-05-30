import styled from "styled-components";

import { Button } from "@components/common/ui/Button/styled";

export const Plans = styled.div`
	top: 20rem;
	left: 20rem;
	position: fixed;
	display: flex;
	z-index: 11;
`;

export const PlanCard = styled.div`
	background: white;
	border-radius: 2rem;
	padding: 4rem;
	width: 32rem;
	height: 100%;
`;

export const PlanName = styled.p`
	font-weight: 600;
	font-size: 2rem;
`;

export const PlanPriceWrapper = styled.div`
	display: flex;
	align-items: flex-end;
`;

export const PlanPrice = styled.p`
	font-weight: 600;
	font-size: 7.2rem;
	margin-bottom: -0.3em;
`;

export const PlanPriceLabel = styled.p`
	font-weight: 400;
	font-size: 2.4rem;
	margin-left: 1rem;
`;

export const PlanDescription = styled.p`
	font-weight: 400;
	font-size: 1.6rem;
	line-height: 140%;
	margin-top: 1.6rem;
`;

export const PlanContent = styled.div`
	padding-bottom: 2rem;
	margin-bottom: 2rem;
	border-bottom: 2px solid ${(props) => props.theme.color.primary};
`;

export const PlanBody = styled.div`
	margin: 4rem 0;
`;

export const PlanFeatures = styled.ul`
	font-weight: 400;
	font-size: 1.6rem;
	padding-left: 1em;
	line-height: 140%;
`;

export const ButtonWrapper = styled.div`
	${Button} {
		width: 100%;
		padding-top: 1.4rem;
		padding-bottom: 1.4rem;
		border-radius: 1rem;
	}
`;
