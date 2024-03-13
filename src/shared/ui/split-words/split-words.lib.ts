export const splitWords = (string: string) =>
	string.split(" ").flatMap((word, index) => (index !== 0 ? [" ", word] : [word]));

export const getIndex = (words: string[][], rowIndex: number, localIndex: number) => {
	let index = localIndex;

	for (let i = 0; i < rowIndex; i++) {
		index += words[i].length;
	}

	return index;
};

export const toStringsArray = (string: string | string[]) =>
	Array.isArray(string) ? string.map(splitWords) : [splitWords(string)];
