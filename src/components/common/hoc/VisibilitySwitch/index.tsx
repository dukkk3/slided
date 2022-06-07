import React, { memo } from "react";

export interface Props {
	visible?: boolean;
	unmount?: boolean;
}

export const VisibilitySwitch: React.FC<React.PropsWithChildren<Props>> = memo(
	({ children, unmount = false, visible = true }) => {
		if (!children || (unmount && !visible)) {
			return null;
		}

		if (unmount) return <>{children}</>;

		return (
			<div
				key='div'
				style={{
					...(visible ? {} : { pointerEvents: "none", opacity: 0 }),
					width: "100%",
					height: "100%",
				}}>
				{children}
			</div>
		);
	}
);
