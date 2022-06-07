import { useCallback, useMemo, memo } from "react";
import { Observer } from "mobx-react-lite";

import {
	VisibilitySwitch,
	Props as VisibilitySwitchProps,
} from "@components/common/hoc/VisibilitySwitch";

import { useIterationControls, useIterationsContext } from "@core/hooks";

interface IterationRangeItem {
	type: "opening" | "closing" | "center.opening" | "center.closing";
	iteration: number;
}

type IterationsRange = [IterationRangeItem, IterationRangeItem];

export interface Props extends Omit<VisibilitySwitchProps, "visible"> {
	iteration: number | IterationsRange;
}

export const IterationVisibilitySwitch: React.FC<React.PropsWithChildren<Props>> = memo(
	({ children, iteration, ...rest }) => {
		const [rangeItemA, rangeItemB] = useMemo<IterationsRange>(
			() =>
				Array.isArray(iteration)
					? iteration
					: [
							{ iteration, type: "opening" },
							{ iteration, type: "closing" },
					  ],
			[iteration]
		);

		const iterationsContext = useIterationsContext();
		const iterationControlsA = useIterationControls(rangeItemA.iteration);
		const iterationControlsB = useIterationControls(rangeItemB.iteration);

		const getTarget = useCallback(
			(rangeItem: IterationRangeItem, iterationControls: ReturnType<typeof useIterationControls>) => {
				switch (rangeItem.type) {
					case "center.opening":
						return iterationControls.center.fromStart;
					case "center.closing":
						return iterationControls.center.toEnd;
					case "opening":
						return iterationControls.start;
					case "closing":
						return iterationControls.end;
				}
			},
			[]
		);

		const visible = useCallback(() => {
			const targetA = getTarget(rangeItemA, iterationControlsA);
			const targetB = getTarget(rangeItemB, iterationControlsB);
			return iterationsContext.store.inRange(targetA, targetB);
		}, [
			getTarget,
			rangeItemA,
			rangeItemB,
			iterationsContext,
			iterationControlsA,
			iterationControlsB,
		]);

		return (
			<Observer>
				{() => (
					<VisibilitySwitch {...rest} visible={visible()}>
						{children}
					</VisibilitySwitch>
				)}
			</Observer>
		);
	}
);
