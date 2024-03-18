import { memo } from "react";

import { AssignComponentProps } from "@shared/ui";

import * as S from "./iteration-container.styled";

export interface IterationContainerProps extends React.ComponentProps<"div"> {}

export const IterationContainer = AssignComponentProps(
	memo(({ children, ...rest }: IterationContainerProps) => {
		return (
			<S.IterationsContainer {...rest}>
				<S.Content>{children}</S.Content>
			</S.IterationsContainer>
		);
	}),
	{ S }
);
