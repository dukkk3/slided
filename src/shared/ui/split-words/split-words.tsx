import { memo, useMemo, Fragment } from "react";

import { toStringsArray, getIndex } from "./split-words.lib";
import * as S from "./split-words.styled";

export interface WordWrapperProps {
	value: string;
	index: number;
	count: number;
}

export interface SplitWordsProps<Props extends WordWrapperProps = WordWrapperProps>
	extends React.ComponentProps<"div"> {
	words: string | string[];
	mapWordParams?: (props: WordWrapperProps) => Props;
	rowWrapper: (props: { children?: React.ReactNode }) => React.ReactElement | null;
	wordWrapper: (props: WordWrapperProps & Props) => React.ReactElement | null;
}

const defaultMapWordParams = (props: WordWrapperProps): any => props;

export const SplitWords = memo(
	({
		words,
		rowWrapper: RowWrapper,
		wordWrapper: WordWrapper,
		mapWordParams = defaultMapWordParams,
		...rest
	}: SplitWordsProps) => {
		const wordsArray = useMemo(() => toStringsArray(words), [words]);
		const wordsCount = useMemo(() => wordsArray.flat(Infinity).length, [wordsArray]);

		return (
			<S.SplitWords {...rest}>
				{wordsArray.map((row, rowIndex) => (
					<RowWrapper key={rowIndex}>
						{row.map((word, index) => (
							<Fragment key={index}>
								<WordWrapper
									{...mapWordParams({
										value: word,
										index: getIndex(wordsArray, rowIndex, index),
										count: wordsCount,
									})}
								/>
							</Fragment>
						))}
					</RowWrapper>
				))}
			</S.SplitWords>
		);
	}
) as <Props extends WordWrapperProps = WordWrapperProps>(
	props: SplitWordsProps<Props>
) => React.ReactElement;
