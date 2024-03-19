import { forwardRef } from "react";

import { Loader as LoaderImpl, AssignComponentProps } from "@shared/ui";

import * as S from "./loader.styled";

export interface LoaderProps extends React.ComponentProps<"div"> {}

export const Loader = AssignComponentProps(
	forwardRef<HTMLDivElement, LoaderProps>((props, ref) => {
		return (
			<S.LoaderGroup {...props} ref={ref}>
				<LoaderImpl />
			</S.LoaderGroup>
		);
	}),
	{ S }
);
