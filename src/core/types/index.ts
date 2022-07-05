export type CamelCase2PascalCase<T extends string> = T extends `${infer FirstLetter}${infer _Rest}`
	? `${Capitalize<FirstLetter>}${_Rest}`
	: T;
export type PascalCase2CamelCase<T extends string> = T extends `${infer FirstLetter}${infer _Rest}`
	? `${Uncapitalize<FirstLetter>}${_Rest}`
	: T;

export type KeysMatching<T extends object, V> = {
	[K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

export type IfEquals<T, U, Y = true, N = false> = (<G>() => G extends T ? 1 : 2) extends <
	G
>() => G extends U ? 1 : 2
	? Y
	: N;
