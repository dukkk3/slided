import { animated } from "@react-spring/web";
import styled from "styled-components";

import { User as _User } from "./ui";

export const Designers = styled.div`
	width: 100%;
`;

export const Content = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	visibility: hidden;
`;

export const Users = styled.div`
	top: 0;
	left: 0;
	position: absolute;
	transform-origin: center;
`;

export const User = styled(animated(_User))`
	position: absolute;
`;
