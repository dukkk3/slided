import React, { memo, useMemo } from "react";

import { splitIntoWords, calculateCurrentIndex2D } from "@core/utils";

export interface Props {
	text: string | string[];
	children: (props: {
		word: string;
		index: number;
		count: number;
		rowIndex: number;
		absoluteIndex: number;
	}) => React.ReactNode;
}

export const SplitIntoWords: React.FC<Props> = memo(({ text, children }) => {
	const textAsArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
	const textAsWordsArray = useMemo(
		() => textAsArray.map((row) => splitIntoWords(row, true)) as string[][],
		[textAsArray]
	);
	const count = useMemo(() => textAsWordsArray.flat(Infinity).length, [textAsWordsArray]);

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
});
