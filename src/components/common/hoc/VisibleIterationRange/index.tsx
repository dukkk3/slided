import React from "react";
import { Observer } from "mobx-react-lite";

import { useIterationControls } from "@core/hooks";

export interface Props extends React.PropsWithChildren<{}> {
	start?: number;
	end?: number;
	conditionFN?: () => boolean;
}

export const VisibleIterationRange: React.FC<Props> = ({ children, start, end, conditionFN }) => {
	const iterationControls = useIterationControls();

	if (!children) {
		return null;
	}

	return (
		<Observer>
			{() => (
				<>
					{(
						conditionFN
							? conditionFN()
							: typeof start !== "undefined" && typeof end !== "undefined"
							? iterationControls.store.inRange(start, end)
							: true
					)
						? children
						: React.cloneElement(children as any, { style: { visibility: "hidden" } })}
				</>
			)}
		</Observer>
	);
};
