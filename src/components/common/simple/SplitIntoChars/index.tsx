import React, { memo, useMemo } from "react";

import { splitIntoWords, splitIntoChars, calculateCurrentIndex3D } from "@core/utils";

export interface Props {
	text: string | string[];
	debug?: boolean;
	children: (props: {
		index: number;
		char: string;
		count: number;
		rowIndex: number;
		wordIndex: number;
		absoluteIndex: number;
	}) => React.ReactNode;
}

export const SplitIntoChars: React.FC<Props> = memo(({ text, children, debug = false }) => {
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
							{word.map((char, charIndex) => {
								const absoluteIndex = calculateCurrentIndex3D(
									textAsCharsArray,
									rowIndex,
									wordIndex,
									charIndex
								);

								return (
									<React.Fragment key={absoluteIndex}>
										{children({
											char,
											count,
											rowIndex,
											wordIndex,
											absoluteIndex,
											index: charIndex,
										})}
									</React.Fragment>
								);
							})}
						</span>
					))}
				</p>
			))}
		</>
	);
});
