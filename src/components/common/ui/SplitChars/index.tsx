import React, { memo, useMemo } from "react";
import isEqual from "react-fast-compare";
import classNames from "classnames";

import { splitIntoChars, splitIntoWords, calculateCurrentIndex3D } from "@core/utils/common.utils";

export interface Props {
	text: string | string[];
	swap: boolean;
	renderChar: (props: {
		char: string;
		swap: boolean;
		index: number;
		amount: number;
	}) => React.ReactNode;
}

export const SplitChars: React.FC<Props> = memo(
	({ text, renderChar, swap = false }) => {
		const charsArray = useMemo(
			() =>
				(Array.isArray(text) ? text : [text]).map((row) =>
					splitIntoWords(row, true).map(splitIntoChars)
				) as string[][][],
			[text]
		);

		const charsAmount = useMemo(() => charsArray.flat(Infinity).length, [charsArray]);

		return (
			<>
				{charsArray.map((row, rowIndex) => (
					<p key={rowIndex} className={classNames("animated-row", "chars")}>
						{row.map((word, wordIndex) => (
							<span key={wordIndex}>
								{word.map((char, charIndex) => (
									<React.Fragment key={charIndex}>
										{renderChar({
											char,
											swap,
											amount: charsAmount,
											index: calculateCurrentIndex3D(charsArray, rowIndex, wordIndex, charIndex),
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
	({ renderChar: _, ...prevProps }, { renderChar: __, ...nextProps }) =>
		isEqual(prevProps, nextProps)
);
