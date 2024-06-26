export const EPSILON = 0.000000001;

export const toRange = (value: number, a: number, b: number) => {
	return value < a ? 0 : value >= b ? 1 : (value - a) / (b - a);
};

export const toInt = (value: number, from: number, to: number) => {
	const size = Math.abs(from - to);
	return Math.floor(from + value * size);
};

export const toScale =
	(factor: number, bound: "in" | "out" = "in") =>
	(value: number) => {
		factor = Math.min(1, factor);
		return toRange(value, bound === "in" || factor === 1 ? 0 : factor, bound === "in" ? factor : 1);
	};

export const toStatus = (value: number) => value > 0 && value <= 1;
export const toInFlight = (value: number) => value > 0 && value <= 1 - EPSILON;
export const toStep = (edge: number) => (value: number) => step(value, edge);

export const step = (value: number, edge: number) => {
	return value < edge ? 0 : 1;
};

export const inRange = (value: number, a: number, b?: number) => {
	if (!b) {
		return Math.floor(value) === a;
	}

	return value >= a && value < b;
};

export const clamp = (number: number, min: number, max: number) => {
	number = Math.max(number, min);
	number = Math.min(number, max);

	return number;
};

export const carriedToRange = (from: number, to: number) => (value: number) =>
	toRange(value, from, to);

export const invert = (value: number) => 1 - value;

export const getRandomInt = (min: number, max: number) => {
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);
	return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
};

export const getRandomItem = <Item>(array: Item[]): Item => array[getRandomInt(0, array.length)];
