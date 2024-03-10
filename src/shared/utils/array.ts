import { getRandomInt } from "./math";

export const getRandomItem = <Item>(array: Item[]): Item => array[getRandomInt(0, array.length)];

export const record = <Key extends string, Value>(
	keys: Key[],
	value: Value | ((key: Key) => Value)
): Record<Key, Value> => {
	return keys.reduce(
		(acc, key) => ({
			...acc,
			[key]: value instanceof Function ? value(key) : value,
		}),
		{} as Record<Key, Value>
	);
};

export const orderBy = <T extends object>(
	items: T[],
	orders: {
		by: keyof T;
		sort?: "asc" | "desc";
	}[]
) =>
	[...items].sort((a, b) => {
		return orders.reduce((acc, order) => {
			const _a = order.sort === "desc" ? b : a;
			const _b = order.sort === "desc" ? a : b;

			const _aProp = _a[order.by];
			const _bProp = _b[order.by];

			let result = 0;

			if (typeof _aProp === "string" || typeof _bProp === "string") {
				result = String(_aProp).localeCompare(String(_bProp));
			} else {
				result = Number(_aProp) - Number(_bProp);
			}

			return acc || result;
		}, 0);
	});
