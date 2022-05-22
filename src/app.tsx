import { Observer } from "mobx-react-lite";

import { Routes } from "@components/routes";

import { useBreakpoint } from "@core/hooks";

export const App: React.FC = () => {
	const breakpoint = useBreakpoint();

	return <Routes />;
};
