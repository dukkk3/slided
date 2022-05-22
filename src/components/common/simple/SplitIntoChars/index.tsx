import React, { memo, useRef } from "react";

import {
	SplitIntoWords,
	Props as SplitIntoWordsProps,
} from "@components/common/simple/SplitIntoWords";

import { splitIntoChars } from "@core/utils";

export interface Props extends Omit<SplitIntoWordsProps, "children"> {
	text: string | string[];
	children: (
		...args: [
			Omit<Parameters<SplitIntoWordsProps["children"]>[0], "word"> & {
				char: string;
				wordIndex: number;
			}
		]
	) => React.ReactNode;
}

export const SplitIntoChars: React.FC<Props> = memo(({ text, children }) => {
	const absoluteIndexRef = useRef(0);

	return (
		<SplitIntoWords text={text}>
			{({ word, index: wordIndex, absoluteIndex, ...rest }) => (
				<>
					{splitIntoChars(word).map((char, index) => {
						const currentAbsoluteIndex = absoluteIndexRef.current;
						absoluteIndexRef.current += 1;
						return (
							<React.Fragment key={currentAbsoluteIndex}>
								{children({ char, index, wordIndex, absoluteIndex: currentAbsoluteIndex, ...rest })}
							</React.Fragment>
						);
					})}
				</>
			)}
		</SplitIntoWords>
	);
});
