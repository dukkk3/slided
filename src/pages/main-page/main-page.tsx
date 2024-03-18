import { interpolators, springUtils } from "@shared/helpers";

import * as assets from "./assets";
import * as model from "./main-page.model";
import * as S from "./main-page.styled";
import {
	Background,
	IterationContainer,
	Iteration0,
	Iteration1_2,
	Iteration5,
	Iteration5_6,
	Iteration3_7,
	Iteration7_8,
	Iteration7_9,
	Iteration9_10,
	Iteration11,
	Assistant,
	Designer,
	Presentation,
} from "./ui";
import { Fragment } from "react";

const contentOpacityProgress = model.smoothedDistanceOfBiggestStep.to(interpolators.toInverted);
const contentPointerEventsProgress = model.smoothedDistanceOfBiggestStep
	.to(interpolators.toStepped(0.999))
	.to((value) => (value ? "none" : "auto"));

const contentStyle = springUtils.optimizeStyleForRendering({
	opacity: contentOpacityProgress,
	pointerEvents: contentPointerEventsProgress,
});

export const MainPage = () => {
	return (
		<S.MainPage>
			<S.BackgroundWrapper style={contentStyle}>
				<Background />
			</S.BackgroundWrapper>
			<S.Overlay>
				<S.Header as='header'>
					<S.Logo src={assets.logo} />
					<S.Navigation>
						<S.NavigationItem>How it works</S.NavigationItem>
						<S.NavigationItem>Pricing</S.NavigationItem>
					</S.Navigation>
				</S.Header>
				<S.Content as='main' style={contentStyle}>
					{[
						<Iteration0 />,
						<Iteration1_2 />,
						<Iteration3_7 />,
						<Iteration5 />,
						<Iteration5_6 />,
						<Iteration7_9 />,
						<Iteration7_8 />,
						<Iteration9_10 />,
						<Iteration9_10 hidden />,
						<Iteration11 />,
					].map((node, index) => (
						<Fragment key={index}>{node}</Fragment>
					))}
					<S.SlideDots />
					<S.FlowContent>
						<Assistant />
						<Designer />
					</S.FlowContent>
					<S.FlowContent style={{ zIndex: 9 }}>
						<Presentation />
					</S.FlowContent>
				</S.Content>
				<S.Buttons>
					{/* <button onClick={() => model.runnedToIteration({ index: 0 })}>to: 0</button>
				<button onClick={() => model.runnedToIteration({ index: 1 })}>to: 1</button>
				<button onClick={() => model.runnedToIteration({ index: 2 })}>to: 2</button>
				<button onClick={() => model.runnedToIteration({ index: 3 })}>to: 3</button>
				<button onClick={() => model.runnedToIteration({ index: 4 })}>to: 4</button>
				<button onClick={() => model.runnedToIteration({ index: 5 })}>to: 5</button>
				<button onClick={() => model.runnedToIteration({ index: 6 })}>to: 6</button>
				<button onClick={() => model.runnedToIteration({ index: 7 })}>to: 7</button> */}
					<S.Debugger>{model.progress}</S.Debugger>
				</S.Buttons>
			</S.Overlay>
		</S.MainPage>
	);
};
