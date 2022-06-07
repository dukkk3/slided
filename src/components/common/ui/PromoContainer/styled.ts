import styled from "styled-components";

import { Container as ContainerImpl } from "@components/common/ui/Container/styled";

export const PromoContainer = styled.div`
	padding-top: var(--header-height);
	padding-bottom: var(--container-gap);
	height: 100vh;
`;

export const Container = styled(ContainerImpl)`
	position: relative;
	height: 100%;
`;
