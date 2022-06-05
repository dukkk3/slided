import { memo } from "react";
import { a, Interpolation } from "react-spring";
import isEqual from "react-fast-compare";

import { SplitChars, Props as SplitCharsProps } from "@components/common/ordinary/SplitChars";

import { useIterationControls } from "@core/hooks";

export interface Props extends Pick<SplitCharsProps, "content"> {
	openingInterpolation: Interpolation<number, number>;
	closingInterpolation: Interpolation<number, number>;
	type: "opening" | "closing";
}

export const AnimatedSplitChars: React.FC<Props> = memo(
	({ type, openingInterpolation, closingInterpolation, ...rest }) => {
		const iterationControls = useIterationControls();

		return (
			<SplitChars
				{...rest}
				swap={type === "opening"}
				renderChar={({ char, amount, index, swap }) => (
					<a.span
						style={{
							opacity: swap
								? openingInterpolation.to((value) => iterationControls.toRange(value, index / amount, 1))
								: closingInterpolation.to((value) => 1 - value),
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
