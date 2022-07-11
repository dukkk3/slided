import { createContext, useCallback, useEffect, useMemo } from "react";
import { easings } from "react-spring";

import {
	useIterationsControlsContextFactory,
	Context as IterationsControlsContext,
} from "@core/hooks/useIterationsContextFactory";
import { useLocalStore } from "@core/hooks/useLocalStore";
import { clamp } from "@core/utils/math.utils";

interface Part {
	duration?: number;
	from: number;
	to: number;
}

type PartIndexWithBound = [index: number, bound: number];

export interface Props extends React.PropsWithChildren<{}> {
	enabled?: boolean;
	defaultDuration?: number;
	parts: (Part | Part[])[];
	stepBetweenIterations?: number;
}

export type Context = IterationsControlsContext & {
	prev: () => void;
	next: () => void;
	partsAmount: number;
	getActivePartIndex: () => number;
	change: (partIndex: number) => void;
	enabled: boolean;
};

export const context = createContext<Context>(null!);

export const IterationsControls: React.FC<Props> = ({
	parts,
	children,
	defaultDuration = 1000,
	enabled = true,
}) => {
	const partsWithShiftedBound = parts.map((part) =>
		Array.isArray(part)
			? part.map((part) => ({ ...part, from: part.from + 0.001 }))
			: { ...part, from: part.from + 0.001 }
	);

	const flattenPartsWithShiftedBound = useMemo(
		() => partsWithShiftedBound.flat(1).sort(({ from: a }, { from: b }) => a - b),
		[partsWithShiftedBound]
	);
	const flattenParts = useMemo(
		() => parts.flat(1).sort(({ from: a }, { from: b }) => a - b),
		[parts]
	);

	const iterations = useMemo(() => Math.max(...flattenParts.map(({ to }) => to)), [flattenParts]);
	const iterationsControlsContext = useIterationsControlsContextFactory({
		iterations,
	});

	const localStore = useLocalStore({
		direction: 0,
		targetPartIndexWithBound: [0, 0] as PartIndexWithBound,
		currentPartIndexWithBound: [0, -1] as PartIndexWithBound,
	});

	const findPartIndex = useCallback(
		(
			partOrIteration: Part | number,
			{ shifted = false, direction }: { direction?: number; shifted?: boolean } = {}
		) => {
			return typeof partOrIteration === "number"
				? (shifted ? flattenPartsWithShiftedBound : flattenParts).findIndex(
						({ from, to }) =>
							(direction === -1 && from < partOrIteration && partOrIteration <= to) ||
							(direction === 1 && from <= partOrIteration && partOrIteration < to) ||
							(!direction && from <= partOrIteration && partOrIteration <= to)
				  )
				: (shifted ? flattenPartsWithShiftedBound : flattenParts).findIndex(
						({ from, to }) => from === partOrIteration.from && to === partOrIteration.to
				  );
		},
		[flattenParts, flattenPartsWithShiftedBound]
	);

	const getPartByIndex = useCallback(
		(index: number) => {
			return flattenParts[index];
		},
		[flattenParts]
	);

	const bootstrapAnimation = useCallback(
		(partIndexWithBound: PartIndexWithBound) => {
			partIndexWithBound[0] = clamp(partIndexWithBound[0], 0, flattenParts.length - 1);
			const part = getPartByIndex(partIndexWithBound[0]);
			if (!part) return;
			const neededIteration = getPartAccessProp(part, partIndexWithBound[1]);
			const { iteration: currentIteration } = iterationsControlsContext.store;
			const durationFactor =
				Math.abs(currentIteration - neededIteration) / Math.abs(part.from - part.to);
			const duration = (part.duration || defaultDuration) * clamp(durationFactor, 0, 1);
			localStore.setCurrentPartIndexWithBound(partIndexWithBound);
			iterationsControlsContext.animate(neededIteration, {
				duration,
				easing: easings.linear,
			});
		},
		[defaultDuration, flattenParts.length, getPartByIndex, iterationsControlsContext, localStore]
	);

	const change = useCallback(
		(partIndexWithBound: PartIndexWithBound, force: boolean = false, neededBound: number = 0) => {
			const part = getPartByIndex(partIndexWithBound[0]);
			const partSource = findPartSource(part, parts);
			const merged = Array.isArray(partSource);
			const long = Math.abs(partIndexWithBound[0] - localStore.currentPartIndexWithBound[0]) > 1;

			if (!partSource) return;

			const direction = getDirectionBtwParts(partIndexWithBound, localStore.currentPartIndexWithBound);

			if (direction === 0) return;

			const boundPart = merged
				? partSource.reduce((acc, part) => {
						const partProp = getPartAccessProp(part, neededBound || direction);
						const accProp = getPartAccessProp(acc, neededBound || direction);
						return ((neededBound || direction) === -1 && partProp < accProp) ||
							((neededBound || direction) === 1 && partProp > accProp)
							? part
							: acc;
				  }, partSource[0])
				: partSource;
			const boundPartIndex = findPartIndex(boundPart);
			const prevDirection = getDirectionBtwParts(
				localStore.targetPartIndexWithBound,
				localStore.currentPartIndexWithBound
			);

			const nextPartIndexWithBound =
				direction === -1
					? getPrevPartIndexWithBound(localStore.currentPartIndexWithBound)
					: getNextPartIndexWithBound(localStore.currentPartIndexWithBound);

			localStore.setTargetPartIndexWithBound([boundPartIndex, partIndexWithBound[1]]);
			localStore.setDirection(direction);

			if (
				force ||
				(prevDirection !== 0 &&
					prevDirection !== direction &&
					iterationsControlsContext.animated.progress.isAnimating) ||
				!iterationsControlsContext.animated.progress.isAnimating
			)
				bootstrapAnimation(
					merged || long ? nextPartIndexWithBound : localStore.targetPartIndexWithBound
				);
		},
		[iterationsControlsContext, bootstrapAnimation, getPartByIndex, findPartIndex, localStore, parts]
	);

	const handleRest = useCallback(() => {
		const { currentPartIndexWithBound, targetPartIndexWithBound } = localStore;
		const direction = getDirectionBtwParts(targetPartIndexWithBound, currentPartIndexWithBound);
		const nextPartIndexWithBound =
			localStore.direction === -1
				? getPrevPartIndexWithBound(currentPartIndexWithBound)
				: getNextPartIndexWithBound(currentPartIndexWithBound);

		if (nextPartIndexWithBound[0] === localStore.targetPartIndexWithBound[0]) {
			nextPartIndexWithBound[1] = localStore.targetPartIndexWithBound[1];
		}

		if (direction === 0) {
			return;
		}

		bootstrapAnimation(nextPartIndexWithBound);
	}, [bootstrapAnimation, localStore]);

	const next = useCallback(() => {
		// const partIndexWithBound = getNextPartIndexWithBound(
		// 	iterationsControlsContext.animated.progress.isAnimating && localStore
		// 		? localStore.targetPartIndexWithBound
		// 		: localStore.currentPartIndexWithBound
		// );
		const animated = iterationsControlsContext.animated.progress.isAnimating;
		const partIndexWithBound = getNextPartIndexWithBound(
			animated ? localStore.targetPartIndexWithBound : localStore.currentPartIndexWithBound
		);
		change(partIndexWithBound, animated || localStore.direction !== 1);
	}, [change, localStore, iterationsControlsContext]);

	const prev = useCallback(() => {
		const animated = iterationsControlsContext.animated.progress.isAnimating;
		const partIndexWithBound = getPrevPartIndexWithBound(
			animated ? localStore.targetPartIndexWithBound : localStore.currentPartIndexWithBound
		);
		change(partIndexWithBound, animated || localStore.direction !== -1);
	}, [change, localStore, iterationsControlsContext]);

	const smartChange = useCallback(
		(partIndex: number) => {
			const part = parts[partIndex];
			if (!part) return;
			const boundPart = Array.isArray(part) ? part[0] : part;
			partIndex = flattenParts.findIndex((part) => isPartsEquals(part, boundPart));
			change([partIndex, -1], true, -1);
		},
		[change, flattenParts, parts]
	);

	const getActivePartIndex = useCallback(() => {
		const prop = getPartAccessProp(
			getPartByIndex(localStore.targetPartIndexWithBound[0]),
			localStore.targetPartIndexWithBound[1]
		);
		const partIndex = findPartIndex(prop, { shifted: true });
		// return parts.indexOf(partSource);
		const part = getPartByIndex(partIndex);
		const partSource = findPartSource(part, parts);
		if (!partSource) return -1;
		return parts.indexOf(partSource);
	}, [flattenParts, localStore, parts]);

	useEffect(
		() => iterationsControlsContext.addEventListener("rest", handleRest),
		[handleRest, iterationsControlsContext]
	);

	return (
		<context.Provider
			value={{
				...iterationsControlsContext,
				change: smartChange,
				getActivePartIndex,
				prev,
				next,
				enabled,
				partsAmount: parts.length,
			}}>
			{children}
		</context.Provider>
	);
};

const getNextPartIndexWithBound = ([index, bound]: PartIndexWithBound): PartIndexWithBound => {
	return bound === -1 ? [index, 1] : [index + 1, 1];
};

const getPrevPartIndexWithBound = ([index, bound]: PartIndexWithBound): PartIndexWithBound => {
	return bound === -1 ? [index - 1, -1] : [index, -1];
};

const getDirectionBtwParts = (a: PartIndexWithBound, b: PartIndexWithBound): number => {
	switch (true) {
		case a[0] > b[0] || (a[0] === b[0] && a[1] > b[1]):
			return 1;
		case a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]):
			return -1;
		default:
			return 0;
	}
};

const findPartSource = (part: Part, targetParts: (Part | Part[])[]) => {
	return targetParts.find(
		(p) =>
			(Array.isArray(p) && p.some((part2) => isPartsEquals(part, part2))) ||
			(!Array.isArray(p) && isPartsEquals(p, part))
	) as Part[] | Part | undefined;
};

const isPartsEquals = (a: Part, b: Part) => a && b && a.from === b.from && a.to === b.to;
const getPartAccessProp = (part: Part, direction: number): number =>
	part[direction === 1 ? "to" : "from"];
