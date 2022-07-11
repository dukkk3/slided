import React, { memo, useMemo } from "react";
import isEqual from "react-fast-compare";
import classNames from "classnames";

import { splitIntoWords, calculateCurrentIndex2D } from "@core/utils/common.utils";

export interface Props {
	text: string | string[];
	swap: boolean;
	renderWord: (props: {
		word: string;
		swap: boolean;
		index: number;
		amount: number;
	}) => React.ReactNode;
}

export const SplitWords: React.FC<Props> = memo(
	({ text, renderWord, swap = false }) => {
		const wordsArray = useMemo(
			() =>
				(Array.isArray(text) ? text : [text]).map((row) => splitIntoWords(row, true)) as string[][],
			[text]
		);

		const wordsAmount = useMemo(() => wordsArray.flat(Infinity).length, [wordsArray]);

		return (
			<>
				{wordsArray.map((row, rowIndex) => (
					<p key={rowIndex} className={classNames("animated-row", "words")}>
						{row.map((word, index) => (
							<React.Fragment key={index}>
								{renderWord({
									word,
									swap,
									amount: wordsAmount,
									index: calculateCurrentIndex2D(wordsArray, rowIndex, index),
								})}
							</React.Fragment>
						))}
					</p>
				))}
			</>
		);
	},
	({ renderWord: _, ...prevProps }, { renderWord: __, ...nextProps }) =>
		isEqual(prevProps, nextProps)
);
