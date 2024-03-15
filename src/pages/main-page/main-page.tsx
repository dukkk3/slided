import * as model from "./main-page.model";
import * as S from "./main-page.styled";
import { Background, Iteration0, Iteration1_2, Iteration5, Iteration3_7, Assistant } from "./ui";

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
				<Iteration5 />
				<Assistant />
			</S.Content>
			<S.Buttons>
				<button onClick={() => model.runnedToIteration({ index: 0 })}>to: 0</button>
				<button onClick={() => model.runnedToIteration({ index: 1 })}>to: 1</button>
				<button onClick={() => model.runnedToIteration({ index: 2 })}>to: 2</button>
				<button onClick={() => model.runnedToIteration({ index: 3 })}>to: 3</button>
				<button onClick={() => model.runnedToIteration({ index: 4 })}>to: 4</button>
				<button onClick={() => model.runnedToIteration({ index: 5 })}>to: 5</button>
				<button onClick={() => model.runnedToIteration({ index: 6 })}>to: 6</button>
				<button onClick={() => model.runnedToIteration({ index: 7 })}>to: 7</button>
				<S.Debugger>{model.progress}</S.Debugger>
			</S.Buttons>
		</S.MainPage>
	);
};
