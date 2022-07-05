import { createArray } from "@core/utils/common.utils";

interface Item {
	image: HTMLImageElement;
	loaded: boolean;
	loading: boolean;
}

export class Sequence {
	private _items: Item[];
	private _sources: string[];
	readonly amount: number;

	get items(): Readonly<Item>[] {
		return this._items;
	}

	constructor(amount: number, formatSource: (index: number) => string) {
		this._sources = createArray(amount).map((_, index) => formatSource(index));
		this._items = this._sources.map(() => ({
			image: new Image(),
			loading: false,
			loaded: false,
		}));

		this.amount = amount;
	}

	async preload(from: number, to: number) {
		to = Math.min(to, this.items.length - 1);
		from = Math.min(from, to);

		let loadedItemsCount = 0;
		const diff = Math.abs(to - from) + 1;
		const promises: Promise<any>[] = [];

		// console.log({ from, to, amount: this.amount, length: this.items.length });

		for (let i = from; i <= to; i++) {
			const item = this._items[i];
			const source = this._sources[i];

			if (item.loaded || item.loading) {
				loadedItemsCount++;
				continue;
			}

			const promise = new Promise((resolve) => {
				// console.log(item);
				item.image.src = source;
				item.loading = true;
				item.image.onload = () => {
					item.loaded = true;
					item.loading = false;
					resolve(true);
				};
			});

			promises.push(promise);
		}

		if (loadedItemsCount === diff) {
			return true;
		}

		return Promise.all(promises);
	}

	preloadOne(index: number) {
		return this.preload(index, index);
	}

	preloadAll() {
		return this.preload(0, this._sources.length - 1);
	}
}
