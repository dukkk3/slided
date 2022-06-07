import { memo, useEffect } from "react";
import { config, useSpring } from "react-spring";
import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/common/hoc/Iteration";

import { AssistantFace } from "@components/common/ordinary/AssistantFace";

import { useTransformDifference } from "@core/hooks";
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

		useEffect(() => {
			pulseProgressApi.start({
				from: { value: 0 },
				to: { value: 1 },
				loop: { reverse: true },
				config: config.gentle,
			});

			return () => {
				pulseProgressApi.stop();
			};
		}, [pulseProgressApi]);

		return (
			<Iteration
				iteration={[1, 3, 4, 5, 7]}
				visibleCondition={(iteration1, _, __, ___, iteration7) =>
					iteration1.started() && !iteration7.opened()
				}>
				{(iteration1, iteration3, iteration4, iteration5) => (
					<Observer>
						{() => (
							<S.MovedAssistantFace
								style={inlineSwitch(
									iteration3.visible() || iteration4.visible(),
									{
										x: iteration3.interpolations
											.toEasing("easeInOutCubic")
											.opening.to((value) => transformBtwStartAndMiddleContainers.getPosition().x * value),
										y: iteration3.interpolations
											.toEasing("easeInOutCubic")
											.opening.to((value) => transformBtwStartAndMiddleContainers.getPosition().y * value),
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
										...transformBtwStartAndMiddleContainers.startResizeObserver.getSize(),
										...transformBtwStartAndMiddleContainers.getStartOffset(),
									},
									inlineSwitch(
										iteration5.started(),
										{
											x: iteration5.interpolations
												.toEasing("easeInOutCubic")
												.closing.to((value) => transformBtwMiddleAndEndContainers.getPosition().x * value),
											y: iteration5.interpolations
												.toEasing("easeInOutCubic")
												.closing.to((value) => transformBtwMiddleAndEndContainers.getPosition().y * value),
											...transformBtwMiddleAndEndContainers.getStartOffset(),
											...transformBtwMiddleAndEndContainers.startResizeObserver.getSize(),
										},
										{
											...transformBtwStartAndMiddleContainers.startResizeObserver.getSize(),
											...transformBtwStartAndMiddleContainers.getStartOffset(),
										}
									)
								)}>
								<AssistantFace
									openingInterpolation={iteration1.interpolations.toEasing("easeInOutCubic").opening}
									swap={iteration1.opened()}
									pulseInterpolation={inlineSwitch(
										iteration1.opened(),
										pulseInterpolation,
										iteration1.interpolations.toEasing("easeInOutCubic").opening
									)}
								/>
							</S.MovedAssistantFace>
						)}
					</Observer>
				)}
			</Iteration>
		);
	}
);
