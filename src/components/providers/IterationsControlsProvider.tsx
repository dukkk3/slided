import { createContext, memo, useCallback, useContext, useEffect, useMemo } from "react";
import isEqual from "react-fast-compare";

import {
	useIterationsControlsContextFactory,
	Context as IterationsControlsContext,
} from "@core/hooks/useIterationsContextFactory";
import { useLocalStore } from "@core/hooks/useLocalStore";
import { clamp } from "@core/utils/math.utils";
import { easings, SpringValue, useSpring } from "react-spring";
import { resolveSpringAnimation } from "@core/helpers/animation.helper";

interface Part {
	duration?: number;
	from: number;
	to: number;
}

type PartLabel = {
	index: number;
	bound: number;
};

type PartOrMergedParts = Part | Part[];

export interface Props extends React.PropsWithChildren<{}> {
	enabled?: boolean;
	defaultDuration?: number;
	parts: PartOrMergedParts[];
}

type Context = IterationsControlsContext & {
	prev: () => void;
	next: () => void;
	getNeededIteration: () => number;
	getLastIdleIteration: () => number | null;
	getActivePartIndex: () => number;
	hideContent: () => boolean;
	getDurationFactorInRange: (start: number, end: number) => number;
	change: (partIndex: number) => any;
	interactiveEnabled(): boolean;
	hideContentInterpolation: SpringValue<number>;
	readonly partsAmount: number;
};

const context = createContext<Context>(null!);

export const IterationsControlsProvider: React.FC<React.PropsWithChildren<Props>> = memo(
	({ children, parts, defaultDuration = 1000, enabled = true }) => {
		const flatParts = useMemo(() => flat(parts), [parts]);
		const [{ hide: hideContentInterpolation }, hideContentApi] = useSpring(() => ({ hide: 0 }));

		const partsWithShiftedBoundAndAdditionalPart = useMemo(() => {
			const eps = 0.001;
			const partsWithShiftedBound = mapParts(parts, (part) => ({ ...part, to: part.to - eps }));
			const lastPart = flatParts[flatParts.length - 1];
			return [...partsWithShiftedBound, { from: lastPart.to, to: lastPart.to + eps }];
		}, [flatParts, parts]);

		const flatPartsWithShiftedBound = useMemo(
			() => flat(partsWithShiftedBoundAndAdditionalPart),
			[partsWithShiftedBoundAndAdditionalPart]
		);

		const maxIteration = useMemo(() => Math.max(...flatParts.map(({ to }) => to)), [flatParts]);
		const iterationsControlsContext = useIterationsControlsContextFactory({
			iterations: maxIteration,
		});

		const localStore = useLocalStore({
			direction: 0,
			contentHidden: false,
			neededPartLabel: { index: 0, bound: -1 } as PartLabel,
			currentPartLabel: { index: 0, bound: -1 } as PartLabel,
			lastIdleIteration: null as number | null,
			get neededIteration() {
				return getPartAccessProp(flatParts[this.neededPartLabel.index], this.neededPartLabel.bound);
			},
			get activePartIndex() {
				const iteration = getPartAccessProp(
					flatParts[this.neededPartLabel.index],
					this.neededPartLabel.bound
				);
				const partIndex = findPartIndex(flatPartsWithShiftedBound, iteration);
				const part = flatPartsWithShiftedBound[partIndex];
				const partSource = findPartSource(partsWithShiftedBoundAndAdditionalPart, part);
				if (!partSource) return -1;
				return partsWithShiftedBoundAndAdditionalPart.indexOf(partSource);
			},
		});

		const interactiveEnabled = useCallback(() => {
			return !localStore.contentHidden && enabled;
		}, [enabled, localStore]);

		const animate = useCallback(
			(partLabel: PartLabel, force?: boolean) => {
				const part = flatParts[partLabel.index];
				const iteration = getPartAccessProp(part, partLabel.bound);
				const { iteration: currentIteration } = iterationsControlsContext.store;
				const durationFactor =
					part.from <= currentIteration && part.to >= currentIteration
						? Math.abs(currentIteration - iteration) / Math.abs(part.from - part.to)
						: 1;
				const duration = (part.duration || defaultDuration) * clamp(durationFactor, 0.01, 1);

				localStore.setCurrentPartLabel(partLabel);

				return force
					? iterationsControlsContext.set(iteration)
					: iterationsControlsContext.animate(iteration, { duration, easing: easings.linear });
			},
			[defaultDuration, flatParts, iterationsControlsContext, localStore]
		);

		const change = useCallback(
			async (
				partLabel: PartLabel,
				{ neededEdgePartBound, force }: { neededEdgePartBound?: number; force?: boolean } = {}
			) => {
				const part = flatParts[partLabel.index];
				const partSource = findPartSource(parts, part);
				const isMerged = Array.isArray(partSource);
				const direction = getDirectionBtwPartsLabels(partLabel, localStore.neededPartLabel);

				if (!partSource || direction === 0) return;

				const edgePart = isMerged
					? partSource.reduce((acc, part) => {
							const targetDirection = neededEdgePartBound || direction;
							const partProp = getPartAccessProp(part, targetDirection);
							const accProp = getPartAccessProp(acc, targetDirection);
							return (targetDirection === -1 && partProp < accProp) ||
								(targetDirection === 1 && partProp > accProp)
								? part
								: acc;
					  }, partSource[0])
					: partSource;
				const edgePartIndex = findPartIndex(flatParts, edgePart);
				const neededPartLabel = { ...partLabel, index: edgePartIndex };

				const nextPartLabel =
					direction === -1
						? getPrevPartLabel(localStore.currentPartLabel)
						: getNextPartLabel(localStore.currentPartLabel);

				if (
					!iterationsControlsContext.animated.progress.isAnimating ||
					force ||
					direction !== localStore.direction
				) {
					localStore.setNeededPartLabel(neededPartLabel);
					localStore.setDirection(direction);
					localStore.setLastIdleIteration(force ? null : iterationsControlsContext.store.iteration);
					return animate(force ? neededPartLabel : nextPartLabel, force);
				}
			},
			[animate, flatParts, iterationsControlsContext, localStore, parts]
		);

		const smartChange = useCallback(
			async (partIndex: number) => {
				if (!interactiveEnabled()) return;

				const direction = partsWithShiftedBoundAndAdditionalPart.length - 1 === partIndex ? 1 : -1;
				const part = parts[direction === 1 ? partIndex - 1 : partIndex];
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const long = Math.abs(localStore.currentPartLabel.index - partIndex) > 1;
				if (!part) return;
				const edgePart = Array.isArray(part) ? part[0] : part;
				partIndex = flatParts.findIndex((part) => isEqual(part, edgePart));

				if (long) {
					localStore.setContentHidden(true);
					await resolveSpringAnimation(hideContentApi, { hide: 1 });
					await Promise.resolve(
						change(
							{ index: partIndex, bound: direction },
							{ neededEdgePartBound: direction, force: true }
						)
					);
					await resolveSpringAnimation(hideContentApi, { hide: 0 });
					localStore.setContentHidden(false);
				} else {
					change({ index: partIndex, bound: direction }, { neededEdgePartBound: direction });
				}
			},
			[
				interactiveEnabled,
				partsWithShiftedBoundAndAdditionalPart.length,
				parts,
				localStore,
				flatParts,
				hideContentApi,
				change,
			]
		);

		const next = useCallback(() => {
			if (!interactiveEnabled()) return;
			const nextPartLabel = getNextPartLabel(localStore.neededPartLabel);
			change(nextPartLabel);
		}, [change, interactiveEnabled, localStore]);

		const prev = useCallback(() => {
			if (!interactiveEnabled()) return;
			const prevPartLabel = getPrevPartLabel(localStore.neededPartLabel);
			change(prevPartLabel);
		}, [change, interactiveEnabled, localStore]);

		const handleRest = useCallback(() => {
			const { currentPartLabel, neededPartLabel } = localStore;
			const direction = getDirectionBtwPartsLabels(neededPartLabel, currentPartLabel);
			const nextPartLabel =
				localStore.direction === -1
					? getPrevPartLabel(currentPartLabel)
					: getNextPartLabel(currentPartLabel);

			if (nextPartLabel.index === neededPartLabel.index) {
				nextPartLabel.bound = neededPartLabel.bound;
			}

			if (direction === 0) {
				return;
			}

			animate(nextPartLabel);
		}, [animate, localStore]);

		const getDurationFactorInRange = useCallback(
			(start: number, end: number) => {
				const part = flatParts.find((part) => part.from <= start && part.to >= end);
				if (!part) return 1;
				const duration = part.duration || defaultDuration;
				return duration / defaultDuration;
			},
			[defaultDuration, flatParts]
		);

		const getActivePartIndex = useCallback(() => {
			return localStore.activePartIndex;
		}, [localStore]);

		const getNeededIteration = useCallback(() => {
			return localStore.neededIteration;
		}, [localStore]);

		const getLastIdleIteration = useCallback(() => {
			return localStore.lastIdleIteration;
		}, [localStore]);

		const hideContent = useCallback(() => {
			return localStore.contentHidden;
		}, [localStore]);

		useEffect(
			() => iterationsControlsContext.addEventListener("rest", handleRest),
			[handleRest, iterationsControlsContext]
		);

		return (
			<context.Provider
				value={{
					...iterationsControlsContext,
					partsAmount: parts.length,
					getDurationFactorInRange,
					hideContentInterpolation,
					getLastIdleIteration,
					getNeededIteration,
					change: smartChange,
					getActivePartIndex,
					interactiveEnabled,
					hideContent,
					prev,
					next,
				}}>
				{children}
			</context.Provider>
		);
	}
);

export function useIterationsControls() {
	return useContext(context);
}

const flat = (parts: PartOrMergedParts[]) =>
	(parts.flat(Infinity) as Part[]).sort(({ from: a }, { from: b }) => a - b);

const mapParts = (parts: PartOrMergedParts[], callback: (part: Part, index: number) => Part) =>
	parts.map((part, index) => (Array.isArray(part) ? part.map(callback) : callback(part, index)));

const findPartIndex = (parts: Part[], partLabelOrIteration: Part | number) =>
	typeof partLabelOrIteration === "number"
		? parts.findIndex(({ from, to }) => from <= partLabelOrIteration && partLabelOrIteration <= to)
		: parts.findIndex(
				({ from, to }) => from === partLabelOrIteration.from && to === partLabelOrIteration.to
		  );

// const iterationToPartLabel = (parts: Part[], iteration: number): PartLabel => {
// 	const partIndex = findPartIndex(parts, iteration);
// 	const part = parts[partIndex];
// 	const center = part.from + Math.abs(part.from - part.to);
// 	const bound = iteration > center ? 1 : -1;
// 	return {
// 		index: partIndex,
// 		bound,
// 	};
// };

const getPartAccessProp = (part: Part, direction: number): number =>
	part[direction === 1 ? "to" : "from"];

const findPartSource = (parts: PartOrMergedParts[], part: Part) =>
	parts.find(
		(p) =>
			(Array.isArray(p) && p.some((part2) => isEqual(part, part2))) ||
			(!Array.isArray(p) && isEqual(p, part))
	) as PartOrMergedParts | undefined;

const getDirectionBtwPartsLabels = (a: PartLabel, b: PartLabel): number => {
	switch (true) {
		case a.index > b.index || (a.index === b.index && a.bound > b.bound):
			return 1;
		case a.index < b.index || (a.index === b.index && a.bound < b.bound):
			return -1;
		default:
			return 0;
	}
};

const getNextPartLabel = ({ index, bound }: PartLabel, force: boolean = true): PartLabel => {
	if (force) return bound === -1 ? { index, bound: 1 } : { bound, index: index + 1 };
	return bound === -1 ? { index, bound: 1 } : { index: index + 1, bound: -1 };
};

const getPrevPartLabel = ({ index, bound }: PartLabel, force: boolean = true): PartLabel => {
	if (force) return bound === -1 ? { index: index - 1, bound: -1 } : { index, bound: -1 };
	return bound === -1 ? { index: index - 1, bound: 1 } : { index, bound: -1 };
};
