import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { easings } from "react-spring";

import {
	useIterationsControlsContextFactory,
	Context as IterationsControlsContext,
} from "@core/hooks/useIterationsContextFactory";
import { useLocalStore } from "@core/hooks/useLocalStore";
import { clamp } from "@core/utils/math.utils";
import { useDebounce } from "@core/hooks/useDebounce";

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
}

type Context = IterationsControlsContext & {
	prev: () => void;
	next: () => void;
	getPrevIteration: () => number | null;
	getTargetIteration: () => number;
	getActivePartIndex: () => number;
	getDurationFactorInRange: (start: number, end: number) => number;
	change: (partIndex: number) => void;
	readonly partsAmount: number;
	readonly enabled: boolean;
};

const context = createContext<Context>(null!);

export const IterationsControlsProvider: React.FC<Props> = ({
	parts,
	children,
	enabled = true,
	defaultDuration = 1000,
}) => {
	const flattenParts = useMemo(
		() => parts.flat(1).sort(({ from: a }, { from: b }) => a - b),
		[parts]
	);

	const partsWithShiftedBound = useMemo(
		() => [
			...mapParts(parts, (part) => ({
				...part,
				to: part.to - 0.001,
			})),
			{
				from: flattenParts[flattenParts.length - 1].to,
				to: flattenParts[flattenParts.length - 1].to + 0.001,
			},
		],
		[flattenParts, parts]
	);

	const flattenPartsWithShiftedBound = useMemo(
		() => partsWithShiftedBound.flat(1).sort(({ from: a }, { from: b }) => a - b),
		[partsWithShiftedBound]
	);

	const iterations = useMemo(() => Math.max(...flattenParts.map(({ to }) => to)), [flattenParts]);
	const iterationsControlsContext = useIterationsControlsContextFactory({
		iterations,
	});

	const findPartIndex = useCallback(
		(
			partOrIteration: Part | number,
			{ target = flattenParts, direction }: { direction?: number; target?: Part[] } = {}
		) => {
			return typeof partOrIteration === "number"
				? target.findIndex(
						({ from, to }) =>
							(direction === -1 && from < partOrIteration && partOrIteration <= to) ||
							(direction === 1 && from <= partOrIteration && partOrIteration < to) ||
							(!direction && from <= partOrIteration && partOrIteration <= to)
				  )
				: target.findIndex(
						({ from, to }) => from === partOrIteration.from && to === partOrIteration.to
				  );
		},
		[flattenParts]
	);

	const getPartByIndex = useCallback(
		(index: number) => {
			return flattenParts[index];
		},
		[flattenParts]
	);

	const localStore = useLocalStore({
		direction: 0,
		speedy: false,
		prevIteration: null as number | null,
		realPrevIteration: 0,
		targetPartIndexWithBound: [0, 0] as PartIndexWithBound,
		currentPartIndexWithBound: [0, -1] as PartIndexWithBound,
		get targetIteration() {
			return getPartAccessProp(
				getPartByIndex(this.targetPartIndexWithBound[0]),
				this.targetPartIndexWithBound[1]
			);
		},
		get activePartIndex() {
			const prop = getPartAccessProp(
				getPartByIndex(this.targetPartIndexWithBound[0]),
				this.targetPartIndexWithBound[1]
			);
			const partIndex = findPartIndex(prop, { target: flattenPartsWithShiftedBound });
			const part = flattenPartsWithShiftedBound[partIndex];
			const partSource = findPartSource(part, partsWithShiftedBound);
			if (!partSource) return -1;
			return partsWithShiftedBound.indexOf(partSource);
		},
	});

	const updateIterations = useDebounce((partIndexWithBound: PartIndexWithBound) => {
		localStore.setPrevIteration(
			getPartAccessProp(getPartByIndex(partIndexWithBound[0]), partIndexWithBound[1])
		);
	}, 250);

	const bootstrapAnimation = useCallback(
		(partIndexWithBound: PartIndexWithBound) => {
			const safelyPartIndexWithBound = [
				clamp(partIndexWithBound[0], 0, flattenParts.length - 1),
				partIndexWithBound[1],
			] as PartIndexWithBound;
			const neededPartIndexWithBound = safelyPartIndexWithBound;

			const part = getPartByIndex(neededPartIndexWithBound[0]);

			if (!part) return;

			const neededIteration = getPartAccessProp(part, neededPartIndexWithBound[1]);
			const { iteration: currentIteration } = iterationsControlsContext.store;
			const durationFactor =
				Math.abs(currentIteration - neededIteration) / Math.abs(part.from - part.to);
			const duration = localStore.speedy
				? (defaultDuration * 2) /
				  (Math.abs(localStore.targetIteration - localStore.realPrevIteration) || 1)
				: (part.duration || defaultDuration) * clamp(durationFactor, 0, 1);

			localStore.setCurrentPartIndexWithBound(neededPartIndexWithBound);
			iterationsControlsContext.animate(neededIteration, {
				duration,
				easing: easings.linear,
			});
		},
		[defaultDuration, flattenParts.length, getPartByIndex, iterationsControlsContext, localStore]
	);

	const change = useCallback(
		(
			partIndexWithBound: PartIndexWithBound,
			{
				force = false,
				neededBound = 0,
				speedy = false,
			}: { force?: boolean; neededBound?: number; speedy?: boolean } = {}
		) => {
			if (!enabled) return;

			const part = getPartByIndex(partIndexWithBound[0]);
			const partSource = findPartSource(part, parts);
			const merged = Array.isArray(partSource);

			if (!partSource) return;

			const direction = getDirectionBtwParts(partIndexWithBound, localStore.targetPartIndexWithBound);

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
			localStore.setPrevIteration(null);
			localStore.setRealPrevIteration(
				getPartAccessProp(
					getPartByIndex(localStore.currentPartIndexWithBound[0]),
					localStore.currentPartIndexWithBound[1]
				)
			);
			localStore.setSpeedy(speedy);
			updateIterations(localStore.currentPartIndexWithBound);

			if (
				force ||
				(prevDirection !== 0 &&
					prevDirection !== direction &&
					iterationsControlsContext.animated.progress.isAnimating) ||
				!iterationsControlsContext.animated.progress.isAnimating
			)
				bootstrapAnimation(
					merged || force ? nextPartIndexWithBound : localStore.targetPartIndexWithBound
				);
		},
		[
			enabled,
			getPartByIndex,
			parts,
			localStore,
			findPartIndex,
			updateIterations,
			iterationsControlsContext.animated.progress.isAnimating,
			bootstrapAnimation,
		]
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
		const animated = iterationsControlsContext.animated.progress.isAnimating;
		const partIndexWithBound = getNextPartIndexWithBound(
			animated ? localStore.targetPartIndexWithBound : localStore.currentPartIndexWithBound
		);
		change(partIndexWithBound, {
			force: !animated || localStore.direction !== 1,
			speedy: animated && localStore.speedy,
		});
	}, [change, localStore, iterationsControlsContext]);

	const prev = useCallback(() => {
		const animated = iterationsControlsContext.animated.progress.isAnimating;
		const partIndexWithBound = getPrevPartIndexWithBound(
			animated ? localStore.targetPartIndexWithBound : localStore.currentPartIndexWithBound
		);
		change(partIndexWithBound, {
			force: !animated || localStore.direction !== -1,
			speedy: animated && localStore.speedy,
		});
	}, [change, localStore, iterationsControlsContext]);

	const smartChange = useCallback(
		(partIndex: number) => {
			const direction = partsWithShiftedBound.length - 1 === partIndex ? 1 : -1;
			const part = parts[direction === 1 ? partIndex - 1 : partIndex];
			const long = Math.abs(localStore.currentPartIndexWithBound[0] - partIndex) > 1;
			if (!part) return;
			const boundPart = Array.isArray(part) ? part[0] : part;
			partIndex = flattenParts.findIndex((part) => isPartsEquals(part, boundPart));
			change([partIndex, direction], { force: true, neededBound: direction, speedy: long });
		},
		[change, flattenParts, localStore.currentPartIndexWithBound, parts, partsWithShiftedBound.length]
	);

	const getDurationFactorInRange = useCallback(
		(start: number, end: number) => {
			const part = flattenParts.find((part) => part.from <= start && part.to >= end);
			if (!part) return 0;
			const duration = part.duration || defaultDuration;
			return duration / defaultDuration;
		},
		[defaultDuration, flattenParts]
	);

	const getActivePartIndex = useCallback(() => {
		return localStore.activePartIndex;
	}, [localStore]);

	const getTargetIteration = useCallback(() => {
		return localStore.targetIteration;
	}, [localStore]);

	const getPrevIteration = useCallback(() => {
		return localStore.prevIteration;
	}, [localStore]);

	useEffect(
		() => iterationsControlsContext.addEventListener("rest", handleRest),
		[handleRest, iterationsControlsContext]
	);

	return (
		<context.Provider
			value={{
				...iterationsControlsContext,
				getDurationFactorInRange,
				getTargetIteration,
				getPrevIteration,
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

export function useIterationsControls() {
	return useContext(context);
}

const getNextPartIndexWithBound = (
	[index, bound]: PartIndexWithBound,
	force: boolean = true
): PartIndexWithBound => {
	if (force) return bound === -1 ? [index, 1] : [index + 1, 1];
	return bound === -1 ? [index, 1] : [index + 1, -1];
};

const getPrevPartIndexWithBound = (
	[index, bound]: PartIndexWithBound,
	force: boolean = true
): PartIndexWithBound => {
	if (force) return bound === -1 ? [index - 1, -1] : [index, -1];
	return bound === -1 ? [index - 1, 1] : [index, -1];
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

const mapParts = (parts: (Part | Part[])[], callback: (part: Part, index: number) => Part) => {
	return parts.map((part, index) =>
		Array.isArray(part) ? part.map(callback) : callback(part, index)
	);
};
