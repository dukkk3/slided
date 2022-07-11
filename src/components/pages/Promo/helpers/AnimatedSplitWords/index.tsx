import { memo } from "react";
import { a, Interpolation, SpringValue } from "react-spring";
import isEqual from "react-fast-compare";

import { SplitWords, Props as SplitWordsProps } from "@components/common/ui/SplitWords";

import { interpolations } from "@core/helpers/iteration.helper";

export interface Props extends Pick<SplitWordsProps, "text">, React.ComponentProps<"p"> {
	opening?: boolean;
	getOpeningInterpolation: (index: number) => SpringValue<number> | Interpolation<any, number>;
	getClosingInterpolation: (index: number) => SpringValue<number> | Interpolation<any, number>;
}

export const AnimatedSplitWords: React.FC<Props> = memo(
	({ opening, getOpeningInterpolation, getClosingInterpolation, ...rest }) => {
		return (
			<SplitWords
				{...rest}
				swap={opening || false}
				renderWord={({ word, amount, index, swap }) => (
					<a.span
						style={{
							y: (swap
								? getOpeningInterpolation(index).to(interpolations.invert)
								: getClosingInterpolation(index).to(interpolations.range(index / amount, 1))
							).to((value) => `-${100 * value}%`),
							opacity: swap
								? getOpeningInterpolation(index)
								: getClosingInterpolation(index).to(interpolations.invert),
						}}>
						{word}
					</a.span>
				)}
			/>
		);
	},
	(
		{ getOpeningInterpolation: a, getClosingInterpolation: _a, ...prevProps },
		{ getOpeningInterpolation: b, getClosingInterpolation: _b, ...nextProps }
	) => isEqual(prevProps, nextProps)
);
