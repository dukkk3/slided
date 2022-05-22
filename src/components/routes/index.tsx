import { Routes as RoutesImpl, Route } from "react-router-dom";

import { Main } from "@components/pages/Main";
// import { Main3 } from "@components/pages/Main3";
// import { About } from "@components/pages/About";
// import { Contact } from "@components/pages/Contact";
// import { Works } from "@components/pages/Works";

// import { routesConfig } from "@core/config";

export const Routes: React.FC = () => {
	return (
		<RoutesImpl>
			{/* <Route path={routesConfig.browserRoutes.work} element={<Works />} />
			<Route path={routesConfig.browserRoutes.contact} element={<Contact />} />
			<Route path={routesConfig.browserRoutes.about} element={<About />} /> */}
			{/* <Route path='/1' element={<Main2 />} /> */}
			<Route path='*' element={<Main />} />
		</RoutesImpl>
	);
};
