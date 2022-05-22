import * as vectorImages from "./vector";
import * as rasterImages from "./raster";

export type VectorImages = typeof vectorImages;
export type RasterImages = typeof rasterImages;

export type VectorImageNameKind = keyof VectorImages;
export type RasterImageNameKind = keyof RasterImages;

export function getVectorImageByName<T extends VectorImageNameKind>(name: T) {
	const isComponent = typeof vectorImages[name] !== "string";
	const Component = vectorImages[name] as any;
	return (
		isComponent ? <Component className='original' /> : vectorImages[name]
	) as VectorImages[T] extends string ? string : React.ReactNode;
}

export function getRasterImageByName(name: RasterImageNameKind) {
	return rasterImages[name];
}
