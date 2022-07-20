export function step(value: number, edge: number) {
	return value < edge ? 0 : 1;
}

export function calculateScale(a: number, b: number) {
	return a / b;
}

export function calculateCoord(a: number, b: number, aSize: number, bSize: number) {
	return b - a + (bSize - aSize) / 2;
}

export function inRange(value: number, a: number, b?: number) {
	if (!b) {
		return Math.floor(value) === a;
	}

	return value >= a && value < b;
}

export function toRange(value: number, a: number, b: number) {
	return value < a ? 0 : value >= b ? 1 : (value - a) / (b - a);
}

export function clamp(number: number, min: number, max: number) {
	number = Math.max(number, min);
	number = Math.min(number, max);

	return number;
}

export type CompareOperatorKind = "gte" | "gt" | "lt" | "lte" | "equal";

export function compare(value: number, a: number, operator: CompareOperatorKind) {
	switch (operator) {
		case "gt":
			return a > value;
		case "gte":
			return a >= value;
		case "lt":
			return a < value;
		case "equal":
			return a === value;
		case "lte":
			return a <= value;
	}
}
