import { memo } from "react";
import { a, Interpolation } from "react-spring";
import isEqual from "react-fast-compare";

import { SplitChars, Props as SplitCharsProps } from "@components/common/ui/SplitChars";

import { interpolations } from "@core/helpers/iteration.helper";

export interface Props extends Pick<SplitCharsProps, "text"> {
	openingInterpolation: Interpolation<number, number>;
	closingInterpolation: Interpolation<number, number>;
	type: "opening" | "closing";
}

export const AnimatedSplitChars: React.FC<Props> = memo(
	({ type, openingInterpolation, closingInterpolation, ...rest }) => {
		return (
			<SplitChars
				{...rest}
				swap={type === "opening"}
				renderChar={({ char, amount, index, swap }) => (
					<a.span
						style={{
							opacity: swap
								? openingInterpolation.to(interpolations.range(index / amount, 1))
								: closingInterpolation.to(interpolations.invert),
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
