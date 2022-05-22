import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";
import "lazysizes";

import { StoreProvider } from "@core/store";
import { GlobalStyle } from "@styles";
import { theme } from "@styles/theme";

import { App } from "./app";
import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("app");
const root = ReactDOM.createRoot(container as HTMLDivElement);

root.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<GlobalStyle />
			<StoreProvider>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</StoreProvider>
		</ThemeProvider>
	</React.StrictMode>
);

reportWebVitals();
