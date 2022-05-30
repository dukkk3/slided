import { camelCaseToPascalCase } from "@core/utils";
import type { Schema, SchemaBase } from "@core/types";

export function generateStoreSchema<T extends SchemaBase.Store>(object: T) {
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
			object[`set${camelCaseToPascalCase(key)}`] = function (this: any, value: any) {
				this[key] = value;
			};
			// @ts-ignore
			object[`reset${camelCaseToPascalCase(key)}`] = function (this: any) {
				this[key] = value;
			};
		});

	return object as Schema.Store<T>;
}
