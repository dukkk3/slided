import { memo } from "react";

import { interpolators, springUtils } from "@shared/helpers";
import type { LikeSpringValue } from "@shared/types";
import { SplitWords, type SplitWordsProps, type WordWrapperProps } from "@shared/ui";
import { common, math } from "@shared/utils";

import * as S from "./text-animation.styled";

export interface TextAnimationProps
	extends Pick<Omit<SplitWordsProps, "rowWrapper">, "words">,
		Partial<Pick<SplitWordsProps, "rowWrapper">> {
	isOpening?: boolean;
	openingProgress?: LikeSpringValue<number>;
	closingProgress?: LikeSpringValue<number>;
}

interface WordProps
	extends WordWrapperProps,
		Pick<TextAnimationProps, "isOpening" | "closingProgress" | "openingProgress"> {}

const Word = memo(
	({ isOpening = false, closingProgress, openingProgress, value, index, count }: WordProps) => {
		return (
			<S.Word
				style={springUtils.optimizeStyleForRendering({
					y: common
						.variant({
							if: isOpening,
							then: openingProgress?.to(math.invert),
							else: closingProgress?.to(math.carriedToRange(index / count, 1)),
						})
						?.to(interpolators.toScaledOn(-100))
						.to(interpolators.toPercents),
					opacity: common.variant({
						if: isOpening,
						then: openingProgress,
						else: closingProgress?.to(interpolators.toInverted),
					}),
				})}>
				{value}
			</S.Word>
		);
	}
);

export const TextAnimation = memo(
	({
		isOpening,
		openingProgress,
		closingProgress,
		rowWrapper = S.RowWrapper,
		...rest
	}: TextAnimationProps) => {
		return (
			<SplitWords
				{...rest}
				rowWrapper={rowWrapper}
				wordWrapper={Word}
				mapWordParams={(props) => ({ ...props, isOpening, openingProgress, closingProgress })}
			/>
		);
	}
);
