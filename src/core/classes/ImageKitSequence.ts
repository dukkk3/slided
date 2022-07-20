import ImageKit from "imagekit-javascript";
import urlJoin from "url-join";

import { Sequence } from "./Sequence";

export class ImageKitSequence extends Sequence {
	private static imageKit = new ImageKit({
		urlEndpoint: "https://ik.imagekit.io/64nah4dsw/slided/sequences/",
	});

	constructor(amount: number, path: string) {
		const maxWidth = window.innerWidth;
		const maxHeight = window.innerHeight;

		super(amount, (index) => {
			const pathWithImageName = urlJoin(path, `${String(index + 1).padStart(3, "0")}.jpg`);
			return ImageKitSequence.imageKit.url({
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
