import { memo, useEffect } from "react";
import { config, easings, useSpring } from "react-spring";
import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/common/hoc/Iteration";

import { AssistantFace } from "@components/common/ordinary/AssistantFace";

import { useIterationControls, useTransformDifference } from "@core/hooks";
import { inlineSwitch, toRange } from "@core/utils";

import * as S from "./styled";
import { reaction } from "mobx";

export interface Props {
	startContainerRef?: React.RefObject<any>;
	middleContainerRef?: React.RefObject<any>;
	endContainerRef?: React.RefObject<any>;
}

export const MovedAssistantFace: React.FC<Props> = memo(
	({ startContainerRef, middleContainerRef, endContainerRef }) => {
		const [{ value: pulseProgress }, pulseProgressApi] = useSpring(() => ({ value: 0 }));
		const iteration1 = useIterationControls(1);
		const transformBtwStartAndMiddleContainers = useTransformDifference({
			startRef: startContainerRef,
			endRef: middleContainerRef,
		});
		const transformBtwMiddleAndEndContainers = useTransformDifference({
			startRef: middleContainerRef,
			endRef: endContainerRef,
		});

		const pulseInterpolation = pulseProgress.to<number>({
			range: [0, 0.25, 0.5, 0.75, 1],
			output: [1, 1.1, 1.05, 1.1, 1],
		});

		useEffect(
			() =>
				reaction(
					() => iteration1.opened(),
					(opened) => {
						if (opened) {
							pulseProgressApi.start({
								from: { value: 0 },
								to: { value: 1 },
								loop: { reverse: true },
								config: { friction: 20, tension: 75 },
							});
						} else {
							pulseProgressApi.stop();
						}
					}
				),
			[pulseProgressApi, iteration1]
		);

		return (
			<Iteration
				iteration={[1, 3, 4, 5, 7]}
				visibleCondition={(iteration1, _, __, ___, iteration7) =>
					iteration1.started() && !iteration7.opened()
				}>
				{(iteration1, iteration3, iteration4, iteration5) => (
					<Observer>
						{() => (
							<>
								<S.MovedAssistantFace
									style={{
										...transformBtwStartAndMiddleContainers.startResizeObserver.getSize(),
										...inlineSwitch(
											iteration3.visible() || iteration4.visible(),
											{
												x: iteration3.interpolations
													.toEasing("easeInOutCubic")
													.opening.to((value) => transformBtwStartAndMiddleContainers.getPosition().x * value),
												y: iteration3.interpolations
													.toEasing("easeInOutCubic")
													.opening.to((value) => transformBtwStartAndMiddleContainers.getPosition().y * value),
												...transformBtwStartAndMiddleContainers.getStartOffset(),
											},
											inlineSwitch(
												iteration5.started(),
												{
													x: iteration5.interpolations
														.toEasing("easeInOutCubic")
														.closing.to(
															(value) =>
																transformBtwStartAndMiddleContainers.getPosition().x +
																transformBtwMiddleAndEndContainers.getPosition().x * value
														),
													y: iteration5.interpolations
														.toEasing("easeInOutCubic")
														.closing.to(
															(value) =>
																transformBtwStartAndMiddleContainers.getPosition().y +
																transformBtwMiddleAndEndContainers.getPosition().y * value
														),
													...transformBtwStartAndMiddleContainers.getStartOffset(),
												},
												{
													...transformBtwStartAndMiddleContainers.startResizeObserver.getSize(),
													...transformBtwStartAndMiddleContainers.getStartOffset(),
												}
											)
										),
										scaleX: iteration3.interpolations
											.toEasing("easeInOutCubic")
											.opening.to(
												(value) => 1 - (1 - transformBtwStartAndMiddleContainers.getScale().x) * value
											),
										scaleY: iteration3.interpolations
											.toEasing("easeInOutCubic")
											.opening.to(
												(value) => 1 - (1 - transformBtwStartAndMiddleContainers.getScale().y) * value
											),
									}}>
									<AssistantFace
										openingInterpolation={iteration1.interpolations.toEasing("easeInOutCubic").opening}
										swap={iteration1.opened()}
										pulseInterpolation={inlineSwitch(
											iteration1.opened(),
											pulseInterpolation,
											iteration1.interpolations.toEasing("easeInOutCubic").opening
										)}
										backgroundOpacityInterpolation={iteration5.interpolations
											.toEasing("easeInOutCubic")
											.closing.to((value) => 1 - value)}
									/>
								</S.MovedAssistantFace>
								<S.OverlayBorderGroup
									data-border
									style={{
										...transformBtwMiddleAndEndContainers.startResizeObserver.getSize(),
										...transformBtwMiddleAndEndContainers.getStartOffset(),
										x: iteration5.interpolations
											.toEasing("easeInOutCubic")
											.closing.to((value) => transformBtwMiddleAndEndContainers.getPosition().x * value),
										y: iteration5.interpolations
											.toEasing("easeInOutCubic")
											.closing.to((value) => transformBtwMiddleAndEndContainers.getPosition().y * value),
										opacity: iteration5.interpolations
											.toEasing("easeInOutCubic")
											.closing.to((value) => toRange(value, 0.5, 1)),
									}}>
									<S.Border />
								</S.OverlayBorderGroup>
							</>
						)}
					</Observer>
				)}
			</Iteration>
		);
	}
);
