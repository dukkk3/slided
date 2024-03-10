import viteTsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		viteTsconfigPaths(),
		svgr({
			include: "**/*.svg?react",
		}),
	],
});
