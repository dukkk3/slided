import { forwardRef } from "react";
import { Interpolation } from "react-spring";

import * as S from "./styled";

export interface Props extends Omit<React.ComponentProps<"div">, "children" | "ref"> {
	alternative?: boolean;
	hiddenContent?: boolean;
	openingInterpolation: Interpolation<number, number>;
}

export const Phone = forwardRef<HTMLDivElement, React.PropsWithChildren<Props>>(
	({ children, alternative, openingInterpolation, hiddenContent = false, ...rest }, ref) => {
		return (
			<S.Phone {...rest} ref={ref} $alternative={alternative} $hidden={hiddenContent}>
				<S.Plug
					className='safari-border-radius-overflow-bugfix'
					style={{
						y: openingInterpolation.to((value) => `-${50 * (1 - value)}%`),
						opacity: openingInterpolation,
					}}
				/>
				<S.ContentWrapper>
					<S.Content>{children}</S.Content>
				</S.ContentWrapper>
			</S.Phone>
		);
	}
);
