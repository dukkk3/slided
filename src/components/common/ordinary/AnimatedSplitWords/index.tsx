import { memo } from "react";
import { a, Interpolation, SpringValue } from "react-spring";
import isEqual from "react-fast-compare";

import { SplitWords, Props as SplitWordsProps } from "@components/common/ordinary/SplitWords";

import { toRange, inlineSwitch } from "@core/utils";

export interface Props extends Pick<SplitWordsProps, "content"> {
	type: "opening" | "closing";
	getOpeningInterpolation: (index: number) => SpringValue<number> | Interpolation<number, number>;
	closingInterpolation: Interpolation<number, number>;
}

export const AnimatedSplitWords: React.FC<Props> = memo(
	({ type, getOpeningInterpolation, closingInterpolation, ...rest }) => {
		return (
			<SplitWords
				{...rest}
				swap={type === "opening"}
				renderWord={({ word, amount, index, swap }) => (
					<a.span
						style={{
							y: inlineSwitch(
								swap,
								getOpeningInterpolation(index).to((value) => 1 - value),
								closingInterpolation.to((value) => toRange(value, index / amount, 1))
							).to((value) => `-${100 * value}%`),
							opacity: inlineSwitch(
								swap,
								getOpeningInterpolation(index),
								closingInterpolation.to((value) => 1 - value)
							),
						}}>
						{word}
					</a.span>
				)}
			/>
		);
	},
	(
		{ getOpeningInterpolation: a, closingInterpolation: _a, ...prevProps },
		{ getOpeningInterpolation: b, closingInterpolation: _b, ...nextProps }
	) => isEqual(prevProps, nextProps)
);
