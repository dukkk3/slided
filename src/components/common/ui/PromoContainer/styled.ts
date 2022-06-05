import styled from "styled-components";

import { Container as ContainerImpl } from "@components/common/ui/Container/styled";

export const PromoContainer = styled.div`
	padding-top: var(--header-height);
	height: 100vh;
`;

export const Container = styled(ContainerImpl)`
	display: flex;
	justify-content: center;
	position: relative;
	height: 100%;
`;
