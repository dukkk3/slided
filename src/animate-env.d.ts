declare module "animate" {
	export default function animate(
		cb: () => void,
		fps: number
	): {
		resume: () => void;
		pause: () => void;
	};
}
