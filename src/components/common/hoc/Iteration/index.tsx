import { memo, useCallback, useMemo } from "react";
import { Observer } from "mobx-react-lite";

import {
	VisibilitySwitch,
	Props as VisibilitySwitchProps,
} from "@components/common/hoc/VisibilitySwitch";

import { useIterationControls, useMultipleHooks } from "@core/hooks";

export interface Props extends VisibilitySwitchProps {
	iteration: number | number[];
	switchVisibility?: boolean;
	visibleCondition?: (...iterationControls: ReturnType<typeof useIterationControls>[]) => boolean;
	children: (...iterationControls: ReturnType<typeof useIterationControls>[]) => JSX.Element;
	normalizeDuration?: boolean;
	forceChildrenRerender?: boolean;
}

export const Iteration: React.FC<Props> = memo(
	({
		children,
		iteration,
		visibleCondition,
		normalizeDuration,
		switchVisibility = true,
		...rest
	}) => {
		const iterationsAsArray = useMemo(
			() => (Array.isArray(iteration) ? iteration : [iteration]),
			[iteration]
		);
		const iterations = useMultipleHooks(
			useIterationControls,
			...iterationsAsArray.map(
				(iteration) => [iteration, { normalizeDuration }] as Parameters<typeof useIterationControls>
			)
		);

		const isVisible = useCallback(() => {
			return visibleCondition ? visibleCondition(...iterations) : iterations[0].visible();
		}, [iterations, visibleCondition]);

		return switchVisibility && (iterationsAsArray.length === 1 || visibleCondition) ? (
			<Observer>
				{() => (
					<VisibilitySwitch key='visibility' visible={isVisible()} {...rest}>
						{children(...iterations)}
					</VisibilitySwitch>
				)}
			</Observer>
		) : (
			children(...iterations)
		);
	}
	// (
	// 	{
	// 		children: childrenA,
	// 		forceChildrenRerender: forceChildrenRerenderA,
	// 		visibleCondition: visibleConditionA,
	// 		...prevProps
	// 	},
	// 	{
	// 		children: childrenB,
	// 		forceChildrenRerender: forceChildrenRerenderB,
	// 		visibleCondition: visibleConditionB,
	// 		...nextProps
	// 	}
	// ) => {
	// 	return forceChildrenRerenderB
	// 		? isEqual({ ...prevProps, children: childrenA }, { ...nextProps, children: childrenB })
	// 		: isEqual(nextProps, prevProps);
	// }
);
