import { motion } from "framer-motion";
import styled from "styled-components";

export const ScrollControls = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	position: absolute;
	overflow: hidden;
`;

export const Container = styled.div`
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: relative;
`;

export const Fixed = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	position: sticky;
	overflow: hidden;
`;

export const Content = styled(motion.div)`
	will-change: transform;
	backface-visibility: hidden;
	transform-style: preserve-3d;
`;

export const Fill = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	position: absolute;
	pointer-events: none;
`;
