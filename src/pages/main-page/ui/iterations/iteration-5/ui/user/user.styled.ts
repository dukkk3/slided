import { animated } from "@react-spring/web";
import styled, { css } from "styled-components";

import { styledMixin } from "@shared/styled";
import { Image } from "@shared/ui";

export type Size = "s" | "m";

export const Avatar = styled(animated(Image))`
	border-radius: 50%;
	overflow: hidden;

	${Image.S.Image} {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

const userSizes: Record<Size, any> = {
	s: css`
		padding: 8px;
		font-size: 14px;
		padding-right: 18px;

		${Avatar} {
			${styledMixin.square("36px")}
		}
	`,
	m: css`
		padding: 10px;
		font-size: 18px;
		padding-right: 50px;

		${Avatar} {
			${styledMixin.square("80px")}
		}
	`,
};

export const Content = styled.div`
	display: flex;
	gap: 2px;
	flex-direction: column;
`;

export const Name = styled.p`
	margin: 0;
	font-weight: 600;
	white-space: nowrap;
`;

export const Rating = styled.div`
	display: flex;
	align-items: center;
`;

export const RatingIcon = styled.div`
	color: black;
	${styledMixin.square("20px")}
`;

export const RatingLabel = styled.p`
	font-weight: 600;
	margin: 0;
`;

export const User = styled.div<{ $size: Size }>`
	display: flex;
	gap: 10px;
	background: white;
	flex-direction: row;
	align-items: center;
	border-radius: 90rem;
	box-shadow: 5px 10px 20px rgba(0, 0, 0, 0.05);

	${({ $size }) => userSizes[$size]}
`;
