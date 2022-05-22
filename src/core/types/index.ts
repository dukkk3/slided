export namespace Schema {
	type GetActionKeys<T extends object> = KeysMatching<T, (...args: any) => any>;

	type StoreDefaultActions<T extends SchemaBase.Store> = {
		[K in Exclude<keyof T, GetActionKeys<T>> as `set${CamelCaseToPascalCase<K>}`]: (
			value: T[K]
		) => void;
	} & {
		[K in Exclude<keyof T, GetActionKeys<T>> as `reset${CamelCaseToPascalCase<K>}`]: () => void;
	};

	export type Store<T extends SchemaBase.Store> = T &
		StoreDefaultActions<T> & {
			[K in GetActionKeys<T>]: T[K];
		};
}

export namespace SchemaBase {
	export type Store = { [s: string]: any };
}

export type CamelCaseToPascalCase<T extends string> = T extends `${infer FirstLetter}${infer _Rest}`
	? `${Capitalize<FirstLetter>}${_Rest}`
	: T;
export type PascalCaseToCamelCase<T extends string> = T extends `${infer FirstLetter}${infer _Rest}`
	? `${Uncapitalize<FirstLetter>}${_Rest}`
	: T;
export type WithSet<T extends string> = `set${T}`;
export type WithoutSet<T extends string> = T extends `set${infer _Rest}` ? _Rest : T;

export type KeysMatching<T extends object, V> = {
	[K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
