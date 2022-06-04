import React, { memo, useMemo } from "react";
import isEqual from "react-fast-compare";

import { splitIntoWords, calculateCurrentIndex2D } from "@core/utils";

export interface Props {
	animated?: boolean;
	swap?: boolean;
	content: string | string[];
	renderWord: (payload: {
		array: string[][];
		word: string;
		swap?: boolean;
		amount: number;
		index: number;
	}) => React.ReactNode;
}

export const SplitWords: React.FC<Props> = memo(
	({ content, renderWord, swap, animated = true }) => {
		const array = useMemo(
			() =>
				(Array.isArray(content) ? content : [content]).map((row) =>
					splitIntoWords(row, true)
				) as string[][],
			[content]
		);
		const amount = useMemo(() => array.flat(Infinity).length, [array]);

		return (
			<>
				{array.map((row, rowIndex) => (
					<p key={rowIndex} className={animated ? "animated-row" : undefined}>
						{row.map((word, index) => (
							<React.Fragment key={index}>
								{renderWord({
									array,
									word,
									swap,
									amount,
									index: calculateCurrentIndex2D(array, rowIndex, index),
								})}
							</React.Fragment>
						))}
					</p>
				))}
			</>
		);
	},
	({ renderWord: a, ...prevProps }, { renderWord: b, ...nextProps }) => isEqual(prevProps, nextProps)
);
