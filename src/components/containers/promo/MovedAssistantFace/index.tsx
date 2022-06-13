import { memo, useEffect } from "react";
import { useSpring } from "react-spring";
import { Observer } from "mobx-react-lite";
import { reaction } from "mobx";

import { Iteration } from "@components/common/hoc/Iteration";

import { AssistantFace } from "@components/common/ordinary/AssistantFace";

import { useIteration, useTransformDifference } from "@core/hooks";
import { inlineSwitch } from "@core/utils";

import * as S from "./styled";

export interface Props {
	startContainerRef?: React.RefObject<any>;
	middleContainerRef?: React.RefObject<any>;
	endContainerRef?: React.RefObject<any>;
}

export const MovedAssistantFace: React.FC<Props> = memo(
	({ startContainerRef, middleContainerRef, endContainerRef }) => {
		const [{ value: pulseProgress }, pulseProgressApi] = useSpring(() => ({ value: 0 }));
		const iteration1 = useIteration(1);
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
				iterations={[1, 3, 4, 5, 7]}
				checkForVisible={([iteration1, , , , iteration7]) =>
					iteration1.started() && !iteration7.opened()
				}>
				{([iteration1, iteration3, iteration4, iteration5], interpolations) => (
					<div>
						<Observer>
							{() => (
								<>
									<S.MovedAssistantFace
										style={{
											...transformBtwStartAndMiddleContainers.startResizeObserver.getSize(),
											...inlineSwitch(
												iteration3.visible() || iteration4.visible(),
												{
													x: iteration3.interpolations.opening
														.to(interpolations.easing("easeInOutCubic"))
														.to((value) => transformBtwStartAndMiddleContainers.getPosition().x * value),
													y: iteration3.interpolations.opening
														.to(interpolations.easing("easeInOutCubic"))
														.to((value) => transformBtwStartAndMiddleContainers.getPosition().y * value),
													...transformBtwStartAndMiddleContainers.getStartOffset(),
												},
												inlineSwitch(
													iteration5.started(),
													{
														x: iteration5.interpolations.closing
															.to(interpolations.easing("easeInOutCubic"))
															.to(
																(value) =>
																	transformBtwStartAndMiddleContainers.getPosition().x +
																	transformBtwMiddleAndEndContainers.getPosition().x * value
															),
														y: iteration5.interpolations.closing
															.to(interpolations.easing("easeInOutCubic"))
															.to(
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
											scaleX: iteration3.interpolations.opening
												.to(interpolations.easing("easeInOutCubic"))
												.to((value) => 1 - (1 - transformBtwStartAndMiddleContainers.getScale().x) * value),
											scaleY: iteration3.interpolations.opening
												.to(interpolations.easing("easeInOutCubic"))
												.to((value) => 1 - (1 - transformBtwStartAndMiddleContainers.getScale().y) * value),
										}}>
										<AssistantFace
											openingInterpolation={iteration1.interpolations.opening.to(
												interpolations.easing("easeInOutCubic")
											)}
											swap={iteration1.opened()}
											pulseInterpolation={inlineSwitch(
												iteration1.opened(),
												pulseInterpolation,
												iteration1.interpolations.opening.to(interpolations.easing("easeInOutCubic"))
											)}
											backgroundOpacityInterpolation={iteration5.interpolations.closing
												.to(interpolations.easing("easeInOutCubic"))
												.to(interpolations.invert)}
										/>
									</S.MovedAssistantFace>
									<S.OverlayBorderGroup
										data-border
										style={{
											...transformBtwMiddleAndEndContainers.startResizeObserver.getSize(),
											...transformBtwMiddleAndEndContainers.getStartOffset(),
											x: iteration5.interpolations.closing
												.to(interpolations.easing("easeInOutCubic"))
												.to((value) => transformBtwMiddleAndEndContainers.getPosition().x * value),
											y: iteration5.interpolations.closing
												.to(interpolations.easing("easeInOutCubic"))
												.to((value) => transformBtwMiddleAndEndContainers.getPosition().y * value),
											opacity: iteration5.interpolations.closing
												.to(interpolations.easing("easeInOutCubic"))
												.to(interpolations.range(0.5, 1)),
										}}>
										<S.Border />
									</S.OverlayBorderGroup>
								</>
							)}
						</Observer>
					</div>
				)}
			</Iteration>
		);
	}
);
