import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { MainPage } from "@pages/main-page";

import { withProviders } from "./providers";

const container = document.getElementById("app");
const root = createRoot(container as HTMLDivElement);

const MainPageWithProviders = withProviders(MainPage);

root.render(
	<StrictMode>
		<MainPageWithProviders />
	</StrictMode>
);
