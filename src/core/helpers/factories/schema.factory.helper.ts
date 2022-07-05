import { camelCase2PascalCase } from "@core/utils/common.utils";
import { KeysMatching, CamelCase2PascalCase, IfEquals } from "@core/types";

const SCHEMA_SYMBOL = Symbol("schema.store");

export namespace Store {
	export type Base = { [s: string]: any };

	export type Schema<T extends Base> = T &
		DefaultActions<T> & {
			[K in GetActionKeys<T>]: T[K];
		} & { [K in GetNonMutableKeys<T>]: T[K] } & { [SCHEMA_SYMBOL]: any };

	type DefaultActions<T extends Base> = {
		[K in Exclude<
			Exclude<keyof T, GetActionKeys<T>>,
			GetNonMutableKeys<T>
		> as `set${CamelCase2PascalCase<K>}`]: (value: T[K]) => void;
	} & {
		[K in Exclude<
			Exclude<keyof T, GetActionKeys<T>>,
			GetNonMutableKeys<T>
		> as `reset${CamelCase2PascalCase<K>}`]: () => void;
	};

	type GetActionKeys<T extends object> = KeysMatching<T, (...args: any) => any>;
	type GetNonMutableKeys<T extends object> = {
		[K in keyof T]: IfEquals<Pick<T, K>, Record<K, T[K]>> extends false ? K : never;
	}[keyof T];
}

export function storeSchemaFactory<T extends Store.Base>(base: T): Store.Schema<T>;
export function storeSchemaFactory<T extends Store.Schema<any>>(base: T): T;

export function storeSchemaFactory(object: any) {
	if (object[SCHEMA_SYMBOL]) return object;

	const entries = Object.entries(object) as any[][];

	entries
		.filter(
			([key, value]) =>
				typeof value !== "function" &&
				!Object.getOwnPropertyDescriptor(object, key)?.get &&
				!Object.getOwnPropertyDescriptor(object, key)?.set
		)
		.forEach(([key, value]) => {
			// @ts-ignore
			object[`set${camelCase2PascalCase(key)}`] = function (this: any, value: any) {
				this[key] = value;
			};
			// @ts-ignore
			object[`reset${camelCase2PascalCase(key)}`] = function (this: any) {
				this[key] = value;
			};
		});

	object[SCHEMA_SYMBOL] = true;

	return object;
}
