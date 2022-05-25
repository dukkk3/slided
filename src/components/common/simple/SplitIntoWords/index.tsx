import React, { memo, useMemo } from "react";
import isEqual from "react-fast-compare";

import { splitIntoWords, calculateCurrentIndex2D } from "@core/utils";

export interface Props {
	text?: string | string[];
	words?: string[][];
	rerenderFlag?: boolean;
	children: (props: {
		word: string;
		index: number;
		count: number;
		rowIndex: number;
		absoluteIndex: number;
	}) => React.ReactNode;
}

export const SplitIntoWords: React.FC<Props> = memo(
	({ text, words, children }) => {
		const wordsAreReceived = useMemo(() => !text && Boolean(words), [text, words]);
		const target = useMemo(() => (text || words) as string[], [text, words]);
		const textAsArray = useMemo(() => (Array.isArray(target) ? target : [target]), [target]);
		const textAsWordsArray = useMemo(
			() =>
				wordsAreReceived
					? (words as string[][])
					: (textAsArray.map((row) => splitIntoWords(row, true)) as string[][]),
			[textAsArray, words, wordsAreReceived]
		);
		const count = useMemo(() => textAsWordsArray.flat(Infinity).length, [textAsWordsArray]);
		console.log(textAsWordsArray);
		return (
			<>
				{textAsWordsArray.map((row, rowIndex) => (
					<p key={rowIndex}>
						{row.map((word, index) => (
							<span key={index} className='animated-inline-unit-wrapper'>
								{children({
									word,
									index,
									count,
									rowIndex,
									absoluteIndex: calculateCurrentIndex2D(textAsWordsArray, rowIndex, index),
								})}
							</span>
						))}
					</p>
				))}
			</>
		);
	},
	({ children: a, ...prevProps }, { children: b, ...nextProps }) => isEqual(prevProps, nextProps)
);
