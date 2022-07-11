import { createContext, useCallback, useMemo } from "react";
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
	enabled: boolean;
	partsAmount: number;
};

export const context = createContext<Context>(null!);

export const IterationsControls: React.FC<Props> = ({
	parts,
	children,
	enabled = true,
	defaultDuration = 1000,
}) => {
	const flattenParts = useMemo(
		() => parts.flat(1).sort(({ from: a }, { from: b }) => a - b),
		[parts]
	);

	// console.log(parts.reduce((acc, part) => [...(Array.isArray(part) ? : part.)]))

	const iterations = useMemo(() => Math.max(...flattenParts.map(({ to }) => to)), [flattenParts]);
	const iterationsControlsContext = useIterationsControlsContextFactory({
		iterations,
	});

	const getDirection = useCallback(
		(iteration: number) => {
			return Math.sign(iteration - iterationsControlsContext.store.iteration);
		},
		[iterationsControlsContext]
	);

	const findPartIndex = useCallback(
		(partOrIteration: Part | number, direction?: number) => {
			return typeof partOrIteration === "number"
				? flattenParts.findIndex(
						({ from, to }) =>
							(direction === -1 && from < partOrIteration && partOrIteration <= to) ||
							(direction === 1 && from <= partOrIteration && partOrIteration < to) ||
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

	const localStore = useLocalStore({
		targetIteration: 0,
	});

	const animate = useCallback(
		(iteration: number) => {
			const direction = getDirection(iteration);
			const partIndex = findPartIndex(iteration, direction);
			const part = getPartByIndex(partIndex);
			const { iteration: currentIteration } = iterationsControlsContext.store;
			if (!part) return;
			const durationFactor = Math.abs(currentIteration - iteration) / Math.abs(part.from - part.to);
			const duration = (part.duration || defaultDuration) * clamp(durationFactor, 0, 1);
			iterationsControlsContext.animate(iteration, { easing: easings.linear, duration });
		},
		[defaultDuration, findPartIndex, getDirection, getPartByIndex, iterationsControlsContext]
	);

	return (
		<context.Provider
			value={{
				...iterationsControlsContext,
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
