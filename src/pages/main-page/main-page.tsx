import { Background } from "./ui/background";

import * as S from "./main-page.styled";
import * as model from "./main-page.model";

export const MainPage = () => {
	return (
		<>
			<Background />
			<S.Buttons>
				<button onClick={() => model.runToProgress(0)}>to: 0</button>
				<button onClick={() => model.runToProgress(1)}>to: 1</button>
				<button onClick={() => model.runToProgress(2)}>to: 2</button>
				<button onClick={() => model.runToProgress(3)}>to: 3</button>
			</S.Buttons>
		</>
	);
};
