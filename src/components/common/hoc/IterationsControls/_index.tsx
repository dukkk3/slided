import { createContext, useCallback, useEffect, useMemo } from "react";
import { SpringConfig } from "react-spring";

import {
	useIterationsControlsContextFactory,
	Context as IterationsControlsContext,
} from "@core/hooks/useIterationsContextFactory";
import { useLocalStore } from "@core/hooks/useLocalStore";
import { clamp } from "@core/utils/math.utils";

interface Part {
	config?: SpringConfig;
	from: number;
	to: number;
}

type PartBound = [index: number, bound: number];

export interface Props extends React.PropsWithChildren<{}> {
	enabled?: boolean;
	parts: (Part | Part[])[];
	stepBetweenIterations?: number;
}

export type Context = IterationsControlsContext & {
	prev: () => void;
	next: () => void;
	change: (...args: any[]) => void;
	enabled: boolean;
};

export const context = createContext<Context>(null!);

export const IterationsControls: React.FC<Props> = ({ children, parts, enabled = true }) => {
	const iterations = useMemo(() => Math.max(...parts.flat(1).map(({ to }) => to)), [parts]);
	const flattenParts = useMemo(
		() => parts.flat(1).sort(({ from: a }, { from: b }) => a - b),
		[parts]
	);
	const iterationsControlsContext = useIterationsControlsContextFactory({
		iterations,
	});

	const localStore = useLocalStore({
		currentPartIndex: [0, 0] as PartBound,
		targetPartIndex: [0, 0] as PartBound,
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
		(partIndex: number, bound: number) => {
			const part = getPartByIndex(partIndex);
			if (!part) return;
			const iteration = getPartAccessProp(part, bound);
			iterationsControlsContext.animate(iteration, part.config);
			localStore.setCurrentPartIndex([partIndex, bound]);
		},
		[getPartByIndex, iterationsControlsContext, localStore]
	);

	const change = useCallback(
		([partIndex, bound]: PartBound) => {
			partIndex = clamp(partIndex, 0, flattenParts.length - 1);
			const part = getPartByIndex(partIndex);
			const partSource = findPartSource(part, parts);
			const merged = Array.isArray(partSource);
			if (!partSource) return;
			const boundPart = merged
				? partSource.reduce((acc, part) => {
						const partProp = getPartAccessProp(part, bound);
						const accProp = getPartAccessProp(acc, bound);
						return (bound === -1 && partProp < accProp) || (bound === 1 && partProp > accProp)
							? part
							: acc;
				  }, partSource[0])
				: partSource;

			const boundPartIndex = findPartIndex(boundPart);
			const direction = getDirectionBtwParts([boundPartIndex, 1], [partIndex, bound]);

			if (direction === 0) return;

			localStore.setTargetPartIndex([boundPartIndex, 1]);
			applyPartConfig(partIndex, bound);
		},
		[
			applyPartConfig,
			findPartIndex,
			findPartSource,
			flattenParts.length,
			getPartByIndex,
			localStore,
			parts,
		]
	);

	const next = useCallback(() => {
		const [index, bound] = getNextPart(localStore.currentPartIndex);
		change([index, bound]);
	}, [change, localStore]);

	const prev = useCallback(() => {
		const [index, bound] = getPrevPart(localStore.currentPartIndex);
		change([index, bound]);
	}, [change, localStore]);

	const handleRest = useCallback(() => {
		const { currentPartIndex, targetPartIndex } = localStore;
		const direction = getDirectionBtwParts(targetPartIndex, currentPartIndex);
		const nextPartIndex =
			direction === -1 ? getPrevPart(currentPartIndex) : getNextPart(currentPartIndex);

		if (direction === 0) return;

		applyPartConfig(...nextPartIndex);
	}, [applyPartConfig, localStore]);

	useEffect(
		() => iterationsControlsContext.addEventListener("rest", handleRest),
		[handleRest, iterationsControlsContext]
	);

	return (
		<context.Provider value={{ ...iterationsControlsContext, change, prev, next, enabled }}>
			{children}
		</context.Provider>
	);
};

const getNextPart = ([index, bound]: PartBound): PartBound => {
	return bound === -1 ? [index, 1] : [index + 1, -1];
};

const getPrevPart = ([index, bound]: PartBound): PartBound => {
	return bound === -1 ? [index - 1, 1] : [index, -1];
};

const getDirectionBtwParts = (a: PartBound, b: PartBound) => {
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
