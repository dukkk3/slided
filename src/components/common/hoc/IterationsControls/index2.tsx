import { createContext, useCallback, useEffect, useMemo } from "react";
import { easings, SpringConfig } from "react-spring";

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
	change: (partIndex: number) => void;
	enabled: boolean;
};

export const context = createContext<Context>(null!);

export const IterationsControls: React.FC<Props> = ({
	children,
	parts,
	defaultDuration = 1000,
	enabled = true,
}) => {
	const iterations = useMemo(() => Math.max(...parts.flat(1).map(({ to }) => to)), [parts]);
	const flattenParts = useMemo(
		() => parts.flat(1).sort(({ from: a }, { from: b }) => a - b),
		[parts]
	);
	const iterationsControlsContext = useIterationsControlsContextFactory({
		iterations,
	});

	const localStore = useLocalStore({
		currentPartIndex: [0, -1] as PartIndexWithBound,
		targetPartIndex: [0, 0] as PartIndexWithBound,
		direction: 0,
	});

	const findPartSource = useCallback((part: Part, targetParts: (Part | Part[])[]) => {
		return targetParts.find(
			(p) =>
				(Array.isArray(p) && p.some((part2) => isPartsEquals(part, part2))) ||
				(!Array.isArray(p) && isPartsEquals(p, part))
		) as Part[] | Part | undefined;
	}, []);

	const findPartIndex = useCallback(
		(partOrIteration: Part | number, direction?: number) => {
			return typeof partOrIteration === "number"
				? flattenParts.findIndex(
						({ from, to }) =>
							(direction === -1 && from <= partOrIteration && partOrIteration < to) ||
							(direction === 1 && from < partOrIteration && partOrIteration <= to) ||
							(!direction && from <= partOrIteration && partOrIteration <= to)
				  )
				: flattenParts.findIndex(
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

	const applyPartConfig = useCallback(
		(partIndexWithBound: PartIndexWithBound) => {
			partIndexWithBound[0] = clamp(partIndexWithBound[0], 0, flattenParts.length - 1);
			const part = getPartByIndex(partIndexWithBound[0]);
			if (!part) return;
			const iteration = getPartAccessProp(part, partIndexWithBound[1]);
			const { iteration: currentIteration } = iterationsControlsContext.store;
			const durationFactor = Math.abs(currentIteration - iteration) / Math.abs(part.from - part.to);
			iterationsControlsContext.animate(iteration, {
				easing: easings.linear,
				duration: (part.duration || defaultDuration) * clamp(durationFactor, 0, 1),
			});
			localStore.setCurrentPartIndex(partIndexWithBound);
		},
		[defaultDuration, flattenParts.length, getPartByIndex, iterationsControlsContext, localStore]
	);

	const change = useCallback(
		(partIndexWithBound: PartIndexWithBound) => {
			const part = getPartByIndex(partIndexWithBound[0]);
			const partSource = findPartSource(part, parts);
			const merged = Array.isArray(partSource);
			if (!partSource) return;
			const direction = getDirectionBtwParts(partIndexWithBound, localStore.currentPartIndex);
			const boundPart = merged
				? partSource.reduce((acc, part) => {
						const partProp = getPartAccessProp(part, direction);
						const accProp = getPartAccessProp(acc, direction);
						return (direction === -1 && partProp < accProp) || (direction === 1 && partProp > accProp)
							? part
							: acc;
				  }, partSource[0])
				: partSource;

			const boundPartIndex = findPartIndex(boundPart);

			if (direction === 0) return;

			// console.log(currentPart);

			localStore.setTargetPartIndex([boundPartIndex, partIndexWithBound[1]]);
			applyPartConfig(partIndexWithBound);
		},
		[applyPartConfig, findPartIndex, findPartSource, getPartByIndex, localStore, parts]
	);

	const next = useCallback(() => {
		const partIndexWithBound = getNextPartIndexWithBound(localStore.currentPartIndex);
		change(partIndexWithBound);
	}, [change, localStore]);

	const prev = useCallback(() => {
		const partIndexWithBound = getPrevPartIndexWithBound(localStore.currentPartIndex);
		change(partIndexWithBound);
	}, [change, localStore]);

	const handleRest = useCallback(() => {
		const { currentPartIndex, targetPartIndex } = localStore;
		const direction = getDirectionBtwParts(targetPartIndex, currentPartIndex);
		const nextPartIndexWithBound =
			direction === -1
				? getPrevPartIndexWithBound(currentPartIndex)
				: getNextPartIndexWithBound(currentPartIndex);
		if (direction === 0) return;
		applyPartConfig(nextPartIndexWithBound);
	}, [applyPartConfig, localStore]);

	const smartChange = useCallback(
		(partIndex: number) => {
			const direction = Math.sign(partIndex - localStore.currentPartIndex[0]);
			switch (direction) {
				case 0:
					return change([partIndex, 1]);
				case 1:
					return change([partIndex, 1]);
				case -1:
					return change([partIndex, 1]);
			}
		},
		[change, localStore]
	);

	useEffect(
		() => iterationsControlsContext.addEventListener("rest", handleRest),
		[handleRest, iterationsControlsContext]
	);

	return (
		<context.Provider
			value={{
				...iterationsControlsContext,
				change: smartChange,
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

const isPartsEquals = (a: Part, b: Part) => a && b && a.from === b.from && a.to === b.to;
const getPartAccessProp = (part: Part, direction: number): number =>
	part[direction === -1 ? "from" : "to"];
