import { memo } from "react";
import { Interpolation } from "react-spring";
import isEqual from "react-fast-compare";

import { Image } from "@components/common/ui/Image";

import * as S from "./styled";

export interface Props {
	templateSource: string;
	openingInterpolation: Interpolation<number, number>;
	fixScaleInterpolation: Interpolation<number, number>;
	type: "opening" | "fix";
}

export const CarTemplate: React.FC<Props> = memo(
	({ type, templateSource, openingInterpolation, fixScaleInterpolation }) => {
		const backgroundScaleInterpolation = openingInterpolation.to(
			(value) => 1 + IMAGE_ADDITIONAL_SCALE * value
		);

		return (
			<S.CarTemplate>
				<S.Template className='safari-border-radius-overflow-bugfix' style={{ background: "red" }}>
					<S.ImageWrapper
						style={
							type === "fix"
								? {
										scaleY: fixScaleInterpolation.to((value) => 1 + IMAGE_ADDITIONAL_SCALE + value),
										scaleX: backgroundScaleInterpolation,
								  }
								: {
										scale: backgroundScaleInterpolation,
								  }
						}
						$zoom={IMAGE_ZOOM}>
						<Image src={templateSource} />
					</S.ImageWrapper>
				</S.Template>
			</S.CarTemplate>
		);
	},
	(
		{ openingInterpolation: a, fixScaleInterpolation: _a, ...prevProps },
		{ openingInterpolation: b, fixScaleInterpolation: _b, ...nextProps }
	) => isEqual(prevProps, nextProps)
);

const IMAGE_ZOOM = 2;
const IMAGE_ADDITIONAL_SCALE = 1 / IMAGE_ZOOM - 1;
