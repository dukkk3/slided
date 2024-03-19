import type { SpringValue, Interpolation } from "@react-spring/web";

export type LikeSpringValue<Value> = SpringValue<Value> | Interpolation<any, Value>;
export type Range = [from: number, to: number];
export type $FixMe = any;
