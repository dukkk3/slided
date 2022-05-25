import React, { memo, useMemo } from "react";
import isEqual from "react-fast-compare";

import { splitIntoWords, splitIntoChars, calculateCurrentIndex3D } from "@core/utils";

export interface Props {
	text: string | string[];
	rerenderFlag?: boolean;
	children: (payload: {
		index: number;
		char: string;
		count: number;
		rowIndex: number;
		wordIndex: number;
		absoluteIndex: number;
	}) => React.ReactNode;
}

export const SplitIntoChars: React.FC<Props> = memo(
	({ text, children }) => {
		const textAsArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
		const textAsCharsArray = useMemo(
			() =>
				textAsArray.map((row) =>
					splitIntoWords(row, true).map((word) => splitIntoChars(word))
				) as string[][][],
			[textAsArray]
		);
		const count = useMemo(() => textAsCharsArray.flat(Infinity).length, [textAsCharsArray]);

		return (
			<>
				{textAsCharsArray.map((row, rowIndex) => (
					<p key={rowIndex}>
						{row.map((word, wordIndex) => (
							<span key={wordIndex} className='animated-inline-unit-wrapper'>
								{word.map((char, charIndex) => (
									<React.Fragment key={charIndex}>
										{children({
											char,
											count,
											rowIndex,
											wordIndex,
											index: charIndex,
											absoluteIndex: calculateCurrentIndex3D(textAsCharsArray, rowIndex, wordIndex, charIndex),
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
	({ children: a, ...prevProps }, { children: b, ...nextProps }) => isEqual(prevProps, nextProps)
);
