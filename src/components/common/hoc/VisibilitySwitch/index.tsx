import React, { memo } from "react";

export interface Props extends Partial<Pick<React.ComponentProps<"div">, "style">> {
	visible?: boolean;
	unmount?: boolean;
}

export const VisibilitySwitch: React.FC<React.PropsWithChildren<Props>> = memo(
	({ children, unmount = false, visible = true, style, ...rest }) => {
		if (!children || (unmount && !visible)) {
			return null;
		}

		if (unmount) return <>{children}</>;

		return (
			<div
				{...rest}
				style={{
					...(style || {}),
					...(visible ? {} : { pointerEvents: "none", opacity: 0 }),
					width: "100%",
					height: "100%",
				}}>
				{children}
			</div>
		);
	}
);
