import { useCallback, useEffect } from "react";

import { Routes } from "@components/routes";

import { useGlobalStore } from "@core/hooks";
import { clientHelper } from "@core/helpers";

export const App: React.FC = () => {
	const layoutStore = useGlobalStore((store) => store.layout);

	const handleWindowResize = useCallback(() => {
		layoutStore.setBreakpoint(clientHelper.detectBreakpoint());
	}, [layoutStore]);

	useEffect(() => {
		window.addEventListener("resize", handleWindowResize);

		return () => {
			window.removeEventListener("resize", handleWindowResize);
		};
	}, [handleWindowResize]);

	return <Routes />;
};
