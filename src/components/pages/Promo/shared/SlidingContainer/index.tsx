import React, { forwardRef } from "react";

import { Icon } from "@components/common/ui/Icon";

import * as S from "./styled";

export interface Props {
	onClose?: () => void;
}

export const SlidingContainer = forwardRef<HTMLDivElement, React.PropsWithChildren<Props>>(
	({ children, onClose }, ref) => {
		return (
			<S.SlidingContainer ref={ref}>
				<S.Content>
					<S.CloseIconGroup onClick={onClose}>
						<Icon name='Close' />
					</S.CloseIconGroup>
					{children}
				</S.Content>
			</S.SlidingContainer>
		);
	}
);
