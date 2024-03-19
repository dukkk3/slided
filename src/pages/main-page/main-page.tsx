import { useSpring } from "@react-spring/web";
import { useGate, useUnit } from "effector-react";
import { Fragment, memo, useEffect } from "react";

import { interpolators, springUtils } from "@shared/helpers";

import * as assets from "./assets";
import * as model from "./main-page.model";
import * as S from "./main-page.styled";
import {
	ScrollSync,
	Background,
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

const contentOpacityProgress = model.smoothedDistanceOfBiggestStep.to(interpolators.toInverted);
const contentPointerEventsProgress = model.smoothedDistanceOfBiggestStep
	.to(interpolators.toStepped(0.999))
	.to((value) => (value ? "none" : "auto"));

const contentStyle = springUtils.optimizeStyleForRendering({
	opacity: contentOpacityProgress,
	pointerEvents: contentPointerEventsProgress,
});

export const MainPage = () => {
	useGate(model.Gate);

	return (
		<ScrollSync>
			<S.MainPage>
				<S.BackgroundWrapper style={contentStyle}>
					<Background />
				</S.BackgroundWrapper>
				<S.Overlay>
					<S.Header as='header'>
						<S.Logo src={assets.logo} />
						<S.Navigation>
							<S.NavigationItem
								onClick={() => {
									model.toIterationRunned({ index: 3 });
								}}>
								How it works
							</S.NavigationItem>
							<S.NavigationItem
								onClick={() => {
									model.toIterationRunned({ index: 9, toEnd: true });
								}}>
								Pricing
							</S.NavigationItem>
						</S.Navigation>
					</S.Header>
					<S.Content style={contentStyle}>
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
						<SlideDots />
						<S.FlowContent>
							<Assistant />
							<Designer />
						</S.FlowContent>
						<S.FlowContent style={{ zIndex: 9 }}>
							<Presentation />
						</S.FlowContent>
					</S.Content>
				</S.Overlay>
				<Loader />
			</S.MainPage>
		</ScrollSync>
	);
};

const SlideDots = memo(() => {
	const interactiveEnabled = useUnit(model.$interactiveEnabled);
	const [style, api] = useSpring(() => ({ progress: 0 }));

	useEffect(() => {
		if (!interactiveEnabled) return;
		api.start({
			from: { progress: 0 },
			to: { progress: 1 },
		});
	}, [api, interactiveEnabled]);

	return (
		<S.SlideDots
			style={{
				opacity: style.progress,
				pointerEvents: style.progress
					.to(interpolators.toStepped(0.999))
					.to((value) => (value ? "auto" : "none")),
			}}
		/>
	);
});

const Loader = memo(() => {
	const contentLoaded = useUnit(model.$contentLoaded);
	const [style, api] = useSpring(() => ({
		progress: 0,
	}));

	useEffect(() => {
		if (!contentLoaded) return;
		api.start({
			from: { progress: 0 },
			to: { progress: 1 },
			onRest: () => model.setLoaderVisible(false),
		});
	}, [api, contentLoaded]);

	return (
		<S.Loader
			style={{
				opacity: style.progress.to(interpolators.toInverted),
				pointerEvents: style.progress
					.to(interpolators.toStepped(0.999))
					.to((value) => (value ? "none" : "auto")),
			}}
		/>
	);
});
