import { math } from "../utils";

type ValueSchema<Value> = { value: Value };
type ResolveInterpolatedValue<Value, Response> = Value extends ValueSchema<any>
	? Value & Response
	: ValueSchema<Value> & Response;

export const createInterpolator = <ExpectedValue, Response>(
	interpolate: (value: ExpectedValue) => Response
) => {
	return <Value extends ExpectedValue | ValueSchema<ExpectedValue>>(
		value: Value
	): ResolveInterpolatedValue<Value, Response> => {
		// @ts-expect-error
		const valueAlreadyInterpolated = typeof value === "object" && "value" in value;
		// @ts-expect-error
		const response = interpolate(valueAlreadyInterpolated ? value.value : value);
		// @ts-expect-error
		return valueAlreadyInterpolated ? { ...value, ...response } : { value, ...response };
	};
};

// export const variant = <Then, Else>({
// 	if: _if,
// 	then,
// 	else: _else,
// }: {
// 	if: Interpolation<any, boolean>;
// 	then: Interpolation<any, Then>;
// 	else: Interpolation<any, Else>;
// }): Interpolation<any, Interpolation<any, Then | Else>> => {
// 	return _if.to((value) => (value ? then : _else));
// };

export const withStatus = createInterpolator((value: number) => ({ status: math.toStatus(value) }));
export const withInFlight = createInterpolator((value: number) => ({
	inFlight: math.toInFlight(value),
}));

export const optimizeStyleRendering = <Style extends object>(
	style: Style
): Style & { willChange?: string } => {
	const willChange: string[] = [];

	const normalize = (item: string) => item.toLowerCase();

	const keys = Object.keys(style).map(normalize);

	const someInKeys = (items: string[]) => items.map(normalize).some((item) => keys.includes(item));

	if (
		someInKeys([
			"x",
			"y",
			"z",
			"transform",
			"skew",
			"translate",
			"translateX",
			"translateY",
			"translateZ",
			"translate3d",
			"rotate",
			"rotateX",
			"rotateY",
			"rotateZ",
			"rotate3d",
			"skewX",
			"skewY",
			"scale",
			"scaleX",
			"scaleY",
			"scaleZ",
			"matrix",
			"matrix3d",
		])
	) {
		willChange.push("transform");
	}

	if (someInKeys(["opacity"])) {
		willChange.push("opacity");
	}

	return {
		...style,
		willChange: willChange.length ? willChange.join(",") : "",
	};
};
