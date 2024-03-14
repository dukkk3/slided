import { memo, cloneElement, Children } from "react";

export interface VisibilityTogglerProps {
	isHidden?: boolean;
	children?: React.ReactNode;
	hideMode?: "unmount" | "display" | "visibility";
}

export const VisibilityToggler = memo(
	({ isHidden, children, hideMode = "visibility" }: VisibilityTogglerProps) => {
		const childrenArray = Children.toArray(children);
		const hiddenStyle =
			hideMode === "display" ? { display: "none" } : { visibility: "hidden", pointerEvents: "none" };

		if (!childrenArray.length || (isHidden && hideMode === "unmount")) {
			return null;
		}

		if (!isHidden) {
			return <>{children}</>;
		}

		return (
			<>
				{childrenArray.map((child: any) =>
					cloneElement(child, { style: { ...child?.props?.style, ...hiddenStyle } })
				)}
			</>
		);
	}
);
