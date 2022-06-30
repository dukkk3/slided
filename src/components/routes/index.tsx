import { Routes as RoutesImpl, Route } from "react-router-dom";

import { Main } from "@components/pages/Main";

import { Layout } from "@components/containers/layout/Layout";

export const Routes: React.FC = () => {
	return (
		<RoutesImpl>
			<Route
				path='*'
				element={
					<Layout>
						<Main />
					</Layout>
				}
			/>
		</RoutesImpl>
	);
};
