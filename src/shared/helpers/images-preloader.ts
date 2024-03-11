import ImageKit from "imagekit-javascript";
import urlJoin from "url-join";

interface Item {
	image: HTMLImageElement;
	isLoaded: boolean;
	isLoading: boolean;
}

export class ImagesPreloader {
	private _items: Item[];
	readonly sources: string[];
	readonly imagesCount: number;

	get items(): Readonly<Item>[] {
		return this._items;
	}

	constructor(count: number, sourceAccessor: (index: number) => string) {
		this.sources = Array.from({ length: count }).map((_, index) => sourceAccessor(index));
		this._items = this.sources.map(() => ({
			image: new Image(),
			isLoading: false,
			isLoaded: false,
		}));

		this.imagesCount = count;
	}

	async preload(from: number, to: number) {
		to = Math.min(to, this.items.length - 1);
		from = Math.min(from, to);

		let loadedItemsCount = 0;
		const diff = Math.abs(to - from) + 1;
		const promises: Promise<Item>[] = [];

		for (let i = from; i <= to; i++) {
			const item = this._items[i];
			const source = this.sources[i];

			if (item.isLoaded || item.isLoading) {
				loadedItemsCount++;
				continue;
			}

			const promise = new Promise<Item>((resolve) => {
				item.image.src = source;
				item.isLoading = true;
				item.image.onload = () => {
					item.isLoaded = true;
					item.isLoading = false;
					resolve(item);
				};
			});

			promises.push(promise);
		}

		if (loadedItemsCount === diff) {
			return this._items.slice(from, to);
		}

		return Promise.all(promises);
	}

	preloadOne(index: number) {
		return this.preload(index, index);
	}

	preloadAll() {
		return this.preload(0, this.sources.length - 1);
	}

	loaded() {
		return this._items.every((item) => item.isLoaded);
	}
}

const imageKit = new ImageKit({
	urlEndpoint: "https://ik.imagekit.io/64nah4dsw/slided/sequences/",
});

export class ImageKitPreloader extends ImagesPreloader {
	constructor(amount: number, path: string) {
		const maxWidth = window.innerWidth;
		const maxHeight = window.innerHeight;

		super(amount, (index) => {
			const pathWithImageName = urlJoin(path, `${String(index + 1).padStart(3, "0")}.jpg`);
			return imageKit.url({
				path: pathWithImageName,
				transformation: [
					{
						width: String(maxWidth),
						height: String(maxHeight),
						crop: "at_least",
						quality: "90",
					},
				],
			});
		});
	}
}
