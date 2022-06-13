import { createArray } from "@core/utils";

export function createImagesSequence(
	length: number,
	formatSource: (index: number) => string,
	duplicates?: { [originIndex: number]: number[] }
) {
	let sequence = [] as { image: HTMLImageElement; loaded: boolean }[];

	const duplicatesEntries = (
		duplicates ? Object.entries(duplicates).map(([key, indexes]) => [Number(key), indexes]) : []
	) as [number, number[]][];
	const sources = createArray(length).map((_, index) => formatSource(index));
	const optimizedSources = duplicates
		? sources.map((source, index) => {
				for (const [originIndex, duplicatesIndexes] of duplicatesEntries) {
					const originSource = sources[originIndex];

					if (duplicatesIndexes.includes(index)) {
						return originSource;
					}
				}

				return source;
		  })
		: sources;

	return {
		getSequence: () => sequence,
		preload: (onLoad?: (index: number) => void) => {
			if (sequence.length > 0) return;
			sequence = optimizedSources.map((source, index) => {
				const image = new Image();
				image.src = source;
				image.onload = () => {
					if (!sequence[index]) return;
					if (onLoad) onLoad(index);
					sequence[index].loaded = true;
				};
				return { image, loaded: false };
			});
		},
	};
}
