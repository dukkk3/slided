import { memo } from "react";
import { Interpolation } from "react-spring";
import isEqual from "react-fast-compare";

import { Image } from "@components/common/ui/Image";

import { getRasterImageByName } from "@assets/images";

import * as S from "./styled";

export interface Props {
	openingInterpolation: Interpolation<number, number>;
	closingInterpolation: Interpolation<number, number>;
	cardZoomInterpolation: Interpolation<number, number>;
	type?: "opening" | "closing";
}

export const TemplatesCards: React.FC<Props> = memo(
	({ openingInterpolation, closingInterpolation, cardZoomInterpolation, type = "opening" }) => {
		return (
			<S.TemplatesCards>
				{TEMPLATES.map((templateSource, index) => ({ templateSource, ...getCardProps(index) })).map(
					({ templateSource, center, offset, sign, normalizedIndex }, index) => (
						<S.Card
							key={index}
							className='safari-border-radius-overflow-bugfix'
							style={{
								translateZ: -5 * normalizedIndex,
								zIndex: center - offset,
								rotateY: closingInterpolation.to((value) => -0.25 * normalizedIndex * sign * (1 - value)),
								opacity: openingInterpolation,
								translateX:
									type === "opening"
										? openingInterpolation.to(
												(value) =>
													`${200 * normalizedIndex * sign + 120 * normalizedIndex * sign * (1 - value)}%`
										  )
										: closingInterpolation.to((value) => `${200 * normalizedIndex * sign * (1 - value)}%`),
								scale: openingInterpolation,
							}}>
							<S.CardImageWrapper
								style={{
									scale:
										index === center ? cardZoomInterpolation.to((value) => 1 + 0.4 * (1 - value)) : undefined,
								}}>
								<Image src={templateSource} lazy={false} />
							</S.CardImageWrapper>
						</S.Card>
					)
				)}
			</S.TemplatesCards>
		);
	},
	(
		{ openingInterpolation: a, closingInterpolation: _a, cardZoomInterpolation: __a, ...prevProps },
		{ openingInterpolation: b, closingInterpolation: _b, cardZoomInterpolation: __b, ...nextProps }
	) => isEqual(prevProps, nextProps)
);

const TEMPLATES = [
	getRasterImageByName("BeigeTemplateSource"),
	getRasterImageByName("BrightTemplateSource"),
	getRasterImageByName("BlueTemplateSource"),
	getRasterImageByName("GreenTemplateSource"),
	getRasterImageByName("SilverTemplateSource"),
];

const TEMPLATES_AMOUNT = TEMPLATES.length;

function getCardProps(index: number) {
	const center = Math.ceil(TEMPLATES_AMOUNT / 2) - 1;
	const offset = Math.abs(index - center);
	const sign = Math.sign(index - center);
	const normalizedIndex = offset / center;
	return { center, offset, sign, normalizedIndex };
}
