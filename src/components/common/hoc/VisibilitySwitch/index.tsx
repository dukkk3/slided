import React, { memo } from "react";

export interface Props extends React.PropsWithChildren<{}> {
	visible?: boolean;
}

export const VisibilitySwitch: React.FC<Props> = memo(({ children, visible = true }) => {
	if (!children) {
		return null;
	}

	return (
		<>
			{visible
				? children
				: React.cloneElement(children as any, {
						style: { ...((children as any).props?.style || {}), pointerEvents: "none", opacity: 0 },
				  })}
		</>
	);
});
