import { memo } from "react";

import { springUtils } from "@shared/helpers";
import type { LikeSpringValue } from "@shared/types";
import { SplitWords, type SplitWordsProps, type WordWrapperProps } from "@shared/ui";
import { math } from "@shared/utils";

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
	({ isOpening, closingProgress, openingProgress, value, index, count }: WordProps) => {
		return (
			<S.Word
				style={springUtils.optimizeStyleForRendering({
					y: (isOpening
						? openingProgress?.to(math.invert)
						: closingProgress?.to(math.carriedToRange(index / count, 1))
					)?.to((value) => `-${100 * value}%`),
					opacity: isOpening ? openingProgress : closingProgress?.to(math.invert),
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
