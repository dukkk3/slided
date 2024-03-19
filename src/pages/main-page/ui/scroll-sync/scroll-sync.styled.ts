import styled from "styled-components";

export const ScrollArea = styled.div<{ $enabled?: boolean }>`
	width: 100vw;
	height: 100vh;
	overflow: ${({ $enabled }) => ($enabled ? "hidden auto" : "hidden")};
`;

export const ScrollContent = styled.div`
	width: 100%;
	visibility: hidden;
`;
