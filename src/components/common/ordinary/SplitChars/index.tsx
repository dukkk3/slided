import React, { memo, useMemo } from "react";
import isEqual from "react-fast-compare";
import classNames from "classnames";

import { splitIntoWords, splitIntoChars, calculateCurrentIndex3D } from "@core/utils";

export interface Props {
	animated?: boolean;
	swap?: boolean;
	content: string | string[];
	renderChar: (payload: {
		array: string[][][];
		swap?: boolean;
		amount: number;
		index: number;
		char: string;
	}) => React.ReactNode;
}

export const SplitChars: React.FC<Props> = memo(
	({ content, renderChar, swap, animated = true }) => {
		const array = useMemo(
			() =>
				(Array.isArray(content) ? content : [content]).map((row) =>
					splitIntoWords(row, true).map(splitIntoChars)
				) as string[][][],
			[content]
		);
		const amount = useMemo(() => array.flat(Infinity).length, [array]);

		return (
			<>
				{array.map((row, rowIndex) => (
					<p key={rowIndex} className={animated ? classNames("animated-row", "chars") : undefined}>
						{row.map((word, wordIndex) => (
							<span key={wordIndex}>
								{word.map((char, charIndex) => (
									<React.Fragment key={charIndex}>
										{renderChar({
											char,
											swap,
											array,
											amount,
											index: calculateCurrentIndex3D(array, rowIndex, wordIndex, charIndex),
										})}
									</React.Fragment>
								))}
							</span>
						))}
					</p>
				))}
			</>
		);
	},
	({ renderChar: a, ...prevProps }, { renderChar: b, ...nextProps }) => isEqual(prevProps, nextProps)
);
