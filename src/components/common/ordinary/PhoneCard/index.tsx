import { forwardRef } from "react";
import { Interpolation } from "react-spring";

import { Image } from "@components/common/ui/Image";

import { getRasterImageByName } from "@assets/images";

import * as S from "./styled";

export interface Props extends React.ComponentProps<"div"> {
	alternative?: boolean;
	hiddenContent?: boolean;
	openingInterpolation: Interpolation<number, number>;
	backgroundZoomInterpolation: Interpolation<number, number>;
}

export const PhoneCard = forwardRef<HTMLDivElement, React.PropsWithChildren<Props>>(
	(
		{
			children,
			alternative,
			openingInterpolation,
			hiddenContent = false,
			backgroundZoomInterpolation,
			...rest
		},
		ref
	) => {
		return (
			<S.PhoneCard {...(rest as any)} ref={ref} $alternative={alternative} $hidden={hiddenContent}>
				<S.Plug
					className='safari-border-radius-overflow-bugfix'
					style={{
						y: openingInterpolation.to((value) => `-${50 * (1 - value)}%`),
						opacity: openingInterpolation,
					}}>
					<S.PlugImageWrapper
						style={{
							translateX: "-35%",
							scale: backgroundZoomInterpolation.to((value) => 1 + 2 * (1 - value)),
							opacity: backgroundZoomInterpolation.to((value) => 0.2 * value),
						}}>
						<Image src={getRasterImageByName("Blue2Template")} lazy={false} />
					</S.PlugImageWrapper>
					<S.PlugImageWrapper
						style={{
							translateX: "-38%",
							scale: backgroundZoomInterpolation.to((value) => 1.8 + 8 * (1 - value)),
							opacity: backgroundZoomInterpolation.to((value) => 0.3 * value),
						}}>
						<Image src={getRasterImageByName("Blue2Template")} lazy={false} />
					</S.PlugImageWrapper>
				</S.Plug>
				<S.ContentWrapper>
					<S.Content>{children}</S.Content>
				</S.ContentWrapper>
			</S.PhoneCard>
		);
	}
);