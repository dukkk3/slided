import { a } from "react-spring";
import styled from "styled-components";

import { Button } from "@components/common/ui/Button/styled";

export { Description, DescriptionWrapper } from "@components/promo/PhoneCard/styled";

export const ButtonWrapper = styled(a.div)`
	position: absolute;
	height: var(--height);
	left: var(--phone-padding);
	bottom: var(--phone-padding);
	width: calc(100% - var(--phone-padding) * 2);

	--height: 6rem;

	${Button} {
		width: 100%;
		height: 100%;
		border-radius: 90rem;
	}

	> * {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		cursor: default;
		border-radius: 90rem;
		position: absolute;
	}
`;

export const CardsWrapper = styled.div`
	margin-top: 2rem;
`;
