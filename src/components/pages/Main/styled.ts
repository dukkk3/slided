import { motion } from "framer-motion";
import styled from "styled-components";

export const Content = styled.div`
	height: 500rem;
`;

export const Wrapper = styled(motion.div)`
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	position: absolute;
`;

export const LayerWrapper = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: absolute;
`;

export const TableBackgroundWrapper = styled(LayerWrapper)`
	z-index: 0;
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
