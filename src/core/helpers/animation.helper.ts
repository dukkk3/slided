import { SpringRef } from "react-spring";

export function resolveSpringAnimation<T extends { [k: string]: any }>(
	control: SpringRef<T>,
	to: ((index: number) => Partial<T>) | Partial<T>
) {
	return new Promise<any>((resolve, reject) => {
		control.start((index) => ({
			...(typeof to === "function" ? to(index) : to),
			onRest: (state) => {
				if (state.finished) {
					resolve(state);
				}
			},
		}));
	});
}
