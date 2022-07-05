import { useEffect, useContext, useRef } from "react";
import { useSpring } from "react-spring";
import { Observer } from "mobx-react-lite";
import { reaction } from "mobx";

import { Iteration } from "@components/common/hoc/Iteration";

import { AssistantFace } from "@components/common/ordinary/AssistantFace";

import { useIteration } from "@core/hooks/useIteration";
import { interpolations } from "@core/helpers/iteration.helper";

import * as S from "./styled";

import { transformsContext } from "../../index";

export interface Props {}

export const MovedAssistantFace: React.FC<Props> = () => {
	const transforms = useContext(transformsContext);
	const videoRef = useRef<HTMLVideoElement>(null);
	const iteration6 = useIteration(6);

	const [{ value: pulseProgress }, pulseProgressApi] = useSpring(() => ({ value: 0 }));
	const iteration1 = useIteration(1);

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

	useEffect(
		() =>
			reaction(
				() => iteration6.opened(),
				(opened) => {
					const video = videoRef.current;
					if (!video) return;
					if (opened) video.pause();
					else if (video.paused) video.play();
				}
			),
		[iteration6]
	);

	return (
		<Iteration
			iterations={[1, 3, 4, 5, 7]}
			checkForVisible={([iteration1, , , , iteration7]) =>
				iteration1.started() && !iteration7.opened()
			}>
			{([iteration1, iteration3, iteration4, iteration5]) => (
				<div>
					<Observer>
						{() => (
							<>
								<S.MovedAssistantFace
									style={{
										...transforms.bigAssistantAndPhoneAssistant.startResizeObserver.getSize(),
										...(iteration3.visible() || iteration4.visible()
											? {
													x: iteration3.interpolations.opening
														.to(interpolations.easing("easeInOutCubic"))
														.to((value) => transforms.bigAssistantAndPhoneAssistant.getPosition().x * value),
													y: iteration3.interpolations.opening
														.to(interpolations.easing("easeInOutCubic"))
														.to((value) => transforms.bigAssistantAndPhoneAssistant.getPosition().y * value),
													...transforms.bigAssistantAndPhoneAssistant.getStartOffset(),
											  }
											: iteration5.started()
											? {
													x: iteration5.interpolations.closing
														.to(interpolations.easing("easeInOutCubic"))
														.to(
															(value) =>
																transforms.bigAssistantAndPhoneAssistant.getPosition().x +
																transforms.phoneAssistantAndShiftedAssistant.getPosition().x * value
														),
													y: iteration5.interpolations.closing
														.to(interpolations.easing("easeInOutCubic"))
														.to(
															(value) =>
																transforms.bigAssistantAndPhoneAssistant.getPosition().y +
																transforms.phoneAssistantAndShiftedAssistant.getPosition().y * value
														),
													...transforms.bigAssistantAndPhoneAssistant.getStartOffset(),
											  }
											: {
													...transforms.bigAssistantAndPhoneAssistant.startResizeObserver.getSize(),
													...transforms.bigAssistantAndPhoneAssistant.getStartOffset(),
											  }),
										scaleX: iteration3.interpolations.opening
											.to(interpolations.easing("easeInOutCubic"))
											.to((value) => 1 - (1 - transforms.bigAssistantAndPhoneAssistant.getScale().x) * value),
										scaleY: iteration3.interpolations.opening
											.to(interpolations.easing("easeInOutCubic"))
											.to((value) => 1 - (1 - transforms.bigAssistantAndPhoneAssistant.getScale().y) * value),
									}}>
									<AssistantFace
										videoRef={videoRef}
										openingInterpolation={iteration1.interpolations.opening.to(
											interpolations.easing("easeInOutCubic")
										)}
										swap={iteration1.opened()}
										pulseInterpolation={
											iteration1.opened()
												? pulseInterpolation
												: iteration1.interpolations.opening.to(interpolations.easing("easeInOutCubic"))
										}
										backgroundOpacityInterpolation={iteration5.interpolations.closing
											.to(interpolations.easing("easeInOutCubic"))
											.to(interpolations.invert)}
									/>
								</S.MovedAssistantFace>
								<S.OverlayBorderGroup
									style={{
										...transforms.phoneAssistantAndShiftedAssistant.startResizeObserver.getSize(),
										...transforms.phoneAssistantAndShiftedAssistant.getStartOffset(),
										x: iteration5.interpolations.closing
											.to(interpolations.easing("easeInOutCubic"))
											.to((value) => transforms.phoneAssistantAndShiftedAssistant.getPosition().x * value),
										y: iteration5.interpolations.closing
											.to(interpolations.easing("easeInOutCubic"))
											.to((value) => transforms.phoneAssistantAndShiftedAssistant.getPosition().y * value),
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
};
