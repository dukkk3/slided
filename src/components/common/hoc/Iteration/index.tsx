import { memo, useCallback, useMemo } from "react";
import { Observer } from "mobx-react-lite";

import {
	VisibilitySwitch,
	Props as VisibilitySwitchProps,
} from "@components/common/hoc/VisibilitySwitch";

import { useIteration, useMultipleHooks } from "@core/hooks";
import { iterationHelper } from "@core/helpers";

type UseIterationParams = Parameters<typeof useIteration>;
type UseIterationReturnType = ReturnType<typeof useIteration>;

export interface Props {
	switchVisibility?: boolean | VisibilitySwitchProps;
	iterations: number | (number | UseIterationParams)[];
	checkForVisible?: (iterations: UseIterationReturnType[]) => boolean;
	children: (
		iteration: UseIterationReturnType[],
		interpolator: typeof iterationHelper.interpolations
	) => JSX.Element;
}

export const Iteration: React.FC<Props> = memo(
	({ children, iterations, checkForVisible, switchVisibility = true }) => {
		const asUseIterationParams = useMemo(() => {
			switch (true) {
				case typeof iterations === "number":
					return [[iterations]];
				case Array.isArray(iterations):
					return (iterations as any[]).map((iteration) => {
						const isArray = Array.isArray(iteration);
						return isArray ? iteration : [iteration];
					});
				default:
					return [];
			}
		}, [iterations]);

		const iterationInstances = useMultipleHooks(
			useIteration,
			...(asUseIterationParams as UseIterationParams[])
		);

		const visible = useCallback(() => {
			return checkForVisible ? checkForVisible(iterationInstances) : iterationInstances[0].visible();
		}, [iterationInstances, checkForVisible]);

		return switchVisibility && (asUseIterationParams.length === 1 || checkForVisible) ? (
			<Observer>
				{() => (
					<VisibilitySwitch
						visible={visible()}
						{...(typeof switchVisibility === "object" ? switchVisibility : {})}>
						{children(iterationInstances, iterationHelper.interpolations)}
					</VisibilitySwitch>
				)}
			</Observer>
		) : (
			children(iterationInstances, iterationHelper.interpolations)
		);
	}
);
