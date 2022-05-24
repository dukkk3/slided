import styled from "styled-components";

export const Content = styled.div`
	/* height: 500rem; */
	height: 100vh;
`;

export const Wrapper = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	position: absolute;
`;

interface LayerWrapperProps {
	$fullscreen?: boolean;
}

export const LayerWrapper = styled.div<LayerWrapperProps>`
	top: 0;
	left: 0;
	width: 100%;
	position: absolute;
	height: ${(props) => props.$fullscreen && "100%"};
	max-height: ${(props) => !props.$fullscreen && "100%"};
`;

export const TableBackgroundWrapper = styled(LayerWrapper)`
	z-index: 0;
	height: 100%;
`;

export const PulseCircleWrapper = styled.div`
	top: 15rem;
	left: 15rem;
	z-index: 1;
	width: 15rem;
	height: 15rem;
	position: absolute;

	video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;
