import { memo } from "react";
import { a, Interpolation } from "react-spring";
import isEqual from "react-fast-compare";

import { SplitChars, Props as SplitCharsProps } from "@components/common/ordinary/SplitChars";

import { toRange, inlineSwitch } from "@core/utils";

export interface Props extends Pick<SplitCharsProps, "content"> {
	logging?: boolean;
	openingInterpolation: Interpolation<number, number>;
	closingInterpolation: Interpolation<number, number>;
	type: "opening" | "closing";
}

export const AnimatedSplitChars: React.FC<Props> = memo(
	({ type, openingInterpolation, closingInterpolation, logging, ...rest }) => {
		if (logging) console.log("rerender");
		return (
			<SplitChars
				{...rest}
				swap={type === "opening"}
				renderChar={({ char, amount, index, swap }) => (
					<a.span
						style={{
							opacity: inlineSwitch(
								swap,
								openingInterpolation.to((value) => toRange(value, index / amount, 1)),
								closingInterpolation.to((value) => 1 - value)
							),
						}}>
						{char}
					</a.span>
				)}
			/>
		);
	},
	(
		{ openingInterpolation: a, closingInterpolation: _a, ...prevProps },
		{ openingInterpolation: b, closingInterpolation: _b, ...nextProps }
	) => isEqual(prevProps, nextProps)
);
