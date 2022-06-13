import styled from "styled-components";

import { Image } from "@components/common/ui/Image/styled";

export const BackgroundSequence = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	position: absolute;
	align-items: center;
	justify-content: center;
`;

export const Canvas = styled.canvas`
	width: 100%;
	height: 100%;
`;

export const BackgroundFrame = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;

	${Image} {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		position: absolute;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
`;
