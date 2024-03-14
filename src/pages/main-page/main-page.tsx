import * as model from "./main-page.model";
import * as S from "./main-page.styled";
import { Background, Iteration0, Iteration1_2, Iteration3_7, Assistant } from "./ui";

export const MainPage = () => {
	return (
		<S.MainPage>
			<S.BackgroundWrapper>
				<Background />
			</S.BackgroundWrapper>
			<S.Content>
				<Iteration0 />
				<Iteration1_2 />
				<Iteration3_7 />
				<Assistant />
			</S.Content>
			<S.Buttons>
				<button onClick={() => model.runToIteration(0)}>to: 0</button>
				<button onClick={() => model.runToIteration(1)}>to: 1</button>
				<button onClick={() => model.runToIteration(2)}>to: 2</button>
				<button onClick={() => model.runToIteration(3)}>to: 3</button>
				<button onClick={() => model.runToIteration(4)}>to: 4</button>
				<button onClick={() => model.runToIteration(5)}>to: 5</button>
				<button onClick={() => model.runToIteration(6)}>to: 6</button>
				<button onClick={() => model.runToIteration(7)}>to: 7</button>
				<S.Debugger>{model.progress}</S.Debugger>
			</S.Buttons>
		</S.MainPage>
	);
};
