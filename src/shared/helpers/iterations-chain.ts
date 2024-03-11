export interface Item {
	from: number;
	to: number;
	in: (progress: number, options?: { lte?: boolean; gte?: boolean }) => boolean;
	duration: number;
}

export type IterationsChain = Item[] & {
	rightBound: number;
	leftBound: number;
};

export const create = () => {
	const iterationsChain: Item[] = [];

	let accumulatedFrom: number = 0;

	const controls = {
		next: (to: number, { duration }: { duration: number }) => {
			const isToAlreadyUsed = iterationsChain.some((item) => item.from >= to || item.to >= to);

			if (isToAlreadyUsed) throw new Error(`To ${to} already used`);

			const from = accumulatedFrom;
			const item: Item = {
				from,
				to,
				in: function (progress, { lte, gte } = {}) {
					const { from, to } = this;
					const inLeftBound = (!gte && from < progress) || (gte && from <= progress);
					const inRightBound = (!lte && to > progress) || (lte && to >= progress);
					return Boolean(inLeftBound && inRightBound);
				},
				duration,
			};

			iterationsChain.push(item);
			accumulatedFrom = to;

			return controls;
		},
		get: (): IterationsChain => {
			return Object.assign(iterationsChain, {
				leftBound: iterationsChain.at(0)!.from,
				rightBound: iterationsChain.at(-1)!.to,
			});
		},
	};

	return controls;
};

export const findItem = (chain: Item[], progress: number, direction: number) => {
	const items = chain.filter((item) => item.in(progress, { gte: true, lte: true }));

	let item: Item;

	if (items.length > 1) {
		item = items.at(direction < 0 ? 0 : -1)!;
	} else {
		item = items[0];
	}

	return item;
};

export const getBoundPropByDirection = (item: Item, target: number, direction: number) => {
	if (direction > 0) {
		return Math.min(target, item.to);
	} else {
		return Math.max(target, item.from);
	}
};
