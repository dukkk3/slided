import { Routes as RoutesImpl, Route } from "react-router-dom";

import { Sandbox } from "@components/pages/Sandbox";

import { Layout } from "@components/containers/layout/Layout";

export const Routes: React.FC = () => {
	return (
		<RoutesImpl>
			<Route
				path='*'
				element={
					<Layout>
						<Sandbox />
					</Layout>
				}
			/>
		</RoutesImpl>
	);
};
