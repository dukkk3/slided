import { useEffect, useMemo } from "react";
import { a, useSpring } from "react-spring";
import { Observer } from "mobx-react-lite";
import { reaction } from "mobx";

import { useIterationsControls } from "@components/providers/IterationsControlsProvider";

import { useIteration } from "@core/hooks/useIteration";
import { useHotkey } from "@core/hooks/useHotkey";
import { createArray } from "@core/utils/common.utils";
import { clamp } from "@core/utils/math.utils";

import { interpolations } from "@core/helpers/iteration.helper";

import { usePromo } from "../../index";

import * as S from "./styled";

export const Controls: React.FC = () => {
	const promo = usePromo();
	const iterationsControls = useIterationsControls();
	const lastIteration = useIteration(iterationsControls.iterations);
	const dotsAmount = useMemo(() => iterationsControls.partsAmount + 1, [iterationsControls]);
	const [flyingDotStyle, flyingDotApi] = useSpring(() => ({ top: "0%" }));

	useHotkey("ArrowUp", iterationsControls.prev);
	useHotkey("ArrowDown", iterationsControls.next);

	useEffect(
		() =>
			reaction(
				() => iterationsControls.getActivePartIndex(),
				(index) => flyingDotApi.start({ top: `${(index / dotsAmount) * 100}%` })
			),
		[dotsAmount, flyingDotApi, iterationsControls]
	);

	return (
		<S.Dots>
			<Observer>
				{() => {
					const prevIteration = iterationsControls.getLastIdleIteration();
					const targetIteration = iterationsControls.getNeededIteration();

					const from = prevIteration === null ? 0 : Math.min(prevIteration, targetIteration);
					const to = prevIteration === null ? 0 : Math.max(prevIteration, targetIteration);
					const interpolation = iterationsControls.animated.progress
						.to(
							interpolations.range(
								from / iterationsControls.iterations,
								to / iterationsControls.iterations
							)
						)
						.to(
							prevIteration === null
								? () => 1
								: prevIteration > targetIteration
								? interpolations.invert
								: interpolations.noop
						);

					return (
						<S.DotGroup $invert={lastIteration.started() || promo.store.feedbackOpened}>
							{createArray(dotsAmount).map((_, index) => (
								<S.Dot
									key={index}
									$active={iterationsControls.getActivePartIndex() === index}
									onClick={() => iterationsControls.change(index)}
								/>
							))}
							<S.FlyingDot style={flyingDotStyle}>
								<svg viewBox={`0 0 ${CIRCLE_VIEW_BOX_SIZE} ${CIRCLE_VIEW_BOX_SIZE}`}>
									<a.circle
										cx={CIRCLE_CENTER}
										cy={CIRCLE_CENTER}
										r={CIRCLE_RADIUS}
										style={{
											opacity: interpolation.to(interpolations.range(0.9, 1)).to(interpolations.invert),
										}}
										strokeDasharray={CIRCLE_CIRCUMFERENCE}
										strokeDashoffset={interpolation.to((value) => getCircleStrokeDashoffset(value * 100))}
									/>
								</svg>
							</S.FlyingDot>
						</S.DotGroup>
					);
				}}
			</Observer>
		</S.Dots>
	);
};

const CIRCLE_RADIUS = 45.5;
const CIRCLE_VIEW_BOX_SIZE = 100;
const CIRCLE_CIRCUMFERENCE = Math.PI * (CIRCLE_RADIUS * 2);
const CIRCLE_CENTER = CIRCLE_VIEW_BOX_SIZE / 2;

function getCircleStrokeDashoffset(progress: number) {
	return ((100 - clamp(progress, 0, 100)) / 100) * CIRCLE_CIRCUMFERENCE;
}
