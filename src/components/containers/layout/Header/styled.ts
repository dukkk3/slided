import styled from "styled-components";

import { Container as ContainerImpl } from "@components/common/ui/Container/styled";
import { Image } from "@components/common/ui/Image/styled";

export const Header = styled.div`
	width: 100%;
`;

export const Container = styled(ContainerImpl)`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: calc(var(--container-gap) * 0.75) 0;
`;

export const Logo = styled.div`
	height: 4.8rem;

	${Image} {
		height: 100%;

		img {
			max-width: initial;
			height: 100%;
		}
	}
`;

const NAV_ITEM_GAP = "2rem";

export const Navbar = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	margin: 0 -${NAV_ITEM_GAP};
`;

export const NavItem = styled.div`
	margin: 0 ${NAV_ITEM_GAP};
`;

export const NavLink = styled.p`
	font-size: 1.6rem;
	font-weight: 700;
	text-decoration: underline;
`;
