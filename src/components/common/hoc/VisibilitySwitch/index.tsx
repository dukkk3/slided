import React, { memo } from "react";

export interface Props {
	visible?: boolean;
	interactive?: boolean;
}

export const VisibilitySwitch: React.FC<React.PropsWithChildren<Props>> = memo(
	({ children, visible = true, interactive = true }) => {
		if (!children) {
			return null;
		}

		return (
			<>
				{React.Children.toArray(children).map((child: any) => {
					const { props } = child;
					const { style } = props || {};
					return React.cloneElement(child as any, {
						style: {
							...(style || {}),
							visibility: !visible && "hidden",
							pointerEvents: (!visible || !interactive) && "none",
						},
					});
				})}
			</>
		);
	}
);
