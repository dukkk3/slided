import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./app";

const container = document.getElementById("app");
const root = ReactDOM.createRoot(container as HTMLDivElement);

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
