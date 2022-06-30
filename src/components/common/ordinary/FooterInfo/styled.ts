import styled from "styled-components";

import { breakpoint } from "@styles/breakpoint";

const ITEM_OFFSET = "2rem";

export const FooterInfo = styled.div`
	width: 100%;
	color: white;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: calc(100% + ${ITEM_OFFSET} * 2);
	margin: 0 -${ITEM_OFFSET};

	${breakpoint("mobile", "tablet")`
		margin: 0;
		width: 100%;
		align-items: flex-end;
		text-transform: lowercase;
	`}
`;

export const ItemGroup = styled.div`
	display: flex;
	align-items: center;
	flex-direction: row;

	${breakpoint("mobile", "tablet")`
		flex-direction: column;
		align-items: flex-start;
	`}
`;

export const ItemWrapper = styled.div`
	margin: 0 ${ITEM_OFFSET};

	${breakpoint("mobile", "tablet")`
		margin: .2rem 0;
	`}
`;

interface ItemProps {
	$asLink?: boolean;
}

export const Item = styled.p<ItemProps>`
	font-weight: 600;
	font-size: 1.6rem;
	color: white;
	text-decoration: ${(props) => props.$asLink && "underline"};

	${breakpoint("mobile", "tablet")`
		font-size: 1.4rem;
	`}
`;
