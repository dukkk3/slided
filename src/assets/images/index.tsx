import * as vectorImages from "./vector";
import * as rasterImages from "./raster";

export type VectorImages = typeof vectorImages;
export type RasterImages = typeof rasterImages;

export type VectorImageTypeKind = keyof VectorImages;
export type RasterImageNameKind = keyof RasterImages;

export function getVectorImageByName<
	T extends VectorImageTypeKind,
	N extends keyof VectorImages[T]
>(
	type: T,
	name: N,
	props?: VectorImages[T][N] extends React.FC ? React.ComponentProps<"svg"> : never
) {
	const isComponent = typeof vectorImages[type][name] !== "string";
	const Component = vectorImages[type][name] as any;
	return (
		isComponent ? <Component {...(props || {})} /> : vectorImages[type][name]
	) as VectorImages[T][N] extends string ? string : React.ReactNode;
}

export function getRasterImageByName(name: RasterImageNameKind) {
	return rasterImages[name];
}

export function getRasterImagesByNames<T extends RasterImageNameKind[]>(...names: T) {
	return names.map((name) => rasterImages[name]);
}
