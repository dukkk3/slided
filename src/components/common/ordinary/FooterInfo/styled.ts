import styled from "styled-components";

import { mobile } from "@styles/breakpoint";

const ITEM_OFFSET = "2.4rem";

export const FooterInfo = styled.div`
	width: 100%;
	color: white;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: calc(100% + ${ITEM_OFFSET} * 2);
	margin: 0 -${ITEM_OFFSET};

	${mobile`
		margin: 0;
		width: 100%;
		align-items: flex-end;
	`}
`;

export const ItemGroup = styled.div`
	display: flex;
	align-items: center;
	flex-direction: row;

	${mobile`
		flex-direction: column;
		align-items: flex-start;
	`}
`;

export const ItemWrapper = styled.div`
	padding: 0 ${ITEM_OFFSET};

	&:not(:nth-child(1)) {
		border-left: 1px solid rgba(255, 255, 255, 0.4);
	}

	${mobile`
		margin: .2rem 0;
		padding :0;
		border-left:none!important;
	`}
`;

interface ItemProps {
	$asLink?: boolean;
}

export const Item = styled.p<ItemProps>`
	font-weight: 400;
	font-size: 1.6rem;
	color: white;

	&:hover {
		text-decoration: ${(props) => props.$asLink && "underline"};
	}

	${mobile`
		font-size: 1.4rem;
	`}
`;
