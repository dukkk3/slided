import { memo, useCallback, useMemo } from "react";
import { Observer } from "mobx-react-lite";

import {
	VisibilitySwitch,
	Props as VisibilitySwitchProps,
} from "@components/common/ui/VisibilitySwitch";

import { useIteration } from "@core/hooks/useIteration";
import { useMultipleHooks } from "@core/hooks/useMultipleHooks";

type UseIterationParams = Parameters<typeof useIteration>;
type UseIterationReturnType = ReturnType<typeof useIteration>;

export interface Props {
	visibilitySwitch?: boolean | VisibilitySwitchProps;
	iterations: number | (number | UseIterationParams)[];
	children: (iteration: UseIterationReturnType[]) => JSX.Element;
	checkForVisible?: (iterations: UseIterationReturnType[]) => boolean;
}

export const Iteration: React.FC<Props> = memo(
	({ children, iterations, checkForVisible, visibilitySwitch = true }) => {
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

		return visibilitySwitch && (asUseIterationParams.length === 1 || checkForVisible) ? (
			<Observer>
				{() => (
					<VisibilitySwitch
						{...(typeof visibilitySwitch === "object" ? visibilitySwitch : {})}
						visible={visible()}>
						{children(iterationInstances)}
					</VisibilitySwitch>
				)}
			</Observer>
		) : (
			children(iterationInstances)
		);
	}
);
