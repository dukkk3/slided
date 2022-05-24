import { useEffect } from "react";
import { a, config, useSpring } from "react-spring";
import { Observer } from "mobx-react-lite";
import { reaction } from "mobx";

import { SplitIntoChars } from "@components/common/simple/SplitIntoChars";

import {
	useIteration,
	useLocalStore,
	useGlobalStore,
	useResizeObserver,
	useIterationControls,
} from "@core/hooks";
import { clamp, calculateElementOffset } from "@core/utils";

import { getVideoByName } from "@assets/videos";

import * as S from "./styled";

const CIRCLE_RADIUS = 45.5;
const CIRCLE_VIEW_BOX_SIZE = 100;
const CIRCLE_CIRCUMFERENCE = Math.PI * (CIRCLE_RADIUS * 2);
const CIRCLE_CENTER = CIRCLE_VIEW_BOX_SIZE / 2;

export const AssistantLayer: React.FC = () => {
	const iterationControls = useIterationControls();
	const faceContainerResizeObserver = useResizeObserver();
	const localStore = useLocalStore({
		facePulseAnimated: false,
		assistantFaceTargetProps: { scaleX: 0, scaleY: 0, y: 0 },
	});
	const promoStore = useGlobalStore((store) => store.layout.promo);

	const {
		interpolations: [iteration1OpeningInterpolation, iteration1ClosingInterpolation],
		...iteration1
	} = useIteration(1);

	const {
		interpolations: [iteration2OpeningInterpolation, iteration2ClosingInterpolation],
		...iteration2
	} = useIteration(2);

	const iteration3 = useIteration(3);

	const [facePulseStyle, facePulseApi] = useSpring(() => ({ scale: 0 }));
	const [assistantFaceStyle, assistantFaceApi] = useSpring(() => ({ scaleX: 1, scaleY: 1, y: 0 }));

	useEffect(
		() =>
			reaction(
				() => [faceContainerResizeObserver.getSize(), promoStore.endPointFaceContainerSize] as const,
				([startFaceSize, endFaceSize]) => {
					const startFaceOffset = calculateElementOffset(faceContainerResizeObserver.ref.current);
					const endFaceOffset = promoStore.endPointFaceOffset;

					const scaleX = endFaceSize.width / startFaceSize.width;
					const scaleY = endFaceSize.height / startFaceSize.height;

					const y =
						endFaceOffset.top - startFaceOffset.top + (endFaceSize.height - startFaceSize.height) / 2;

					localStore.setAssistantFaceTargetProps({ scaleX, scaleY, y });
				}
			),
		[faceContainerResizeObserver, localStore, promoStore]
	);

	useEffect(
		() =>
			reaction(
				() =>
					[
						iterationControls.store.compare(iteration3.start, "lte"),
						iterationControls.store.toRange(iteration3.start, iteration3.center),
						localStore.assistantFaceTargetProps,
					] as const,
				([inRange, range, targetProps]) => {
					if (inRange) {
						const { scaleX, scaleY, y } = targetProps;
						assistantFaceApi.set({
							scaleX: 1 + (scaleX - 1) * range,
							scaleY: 1 + (scaleY - 1) * range,
							y: y * range,
						});
					} else {
						assistantFaceApi.set({ scaleX: 1, scaleY: 1, y: 0 });
					}
				}
			),
		[iterationControls, assistantFaceApi, iteration3, localStore]
	);

	useEffect(
		() =>
			reaction(
				() =>
					iterationControls.store.compare(iteration1.start, "lte") &&
					iterationControls.store.toRange(iteration1.start, iteration1.center) >= 1,
				(animated) => {
					if (animated) {
						facePulseApi.start({
							to: { scale: 1 },
							from: { scale: 0 },
							loop: { reverse: true },
							config: config.gentle,
						});
					} else {
						facePulseApi.stop();
						facePulseApi.set({ scale: 0 });
					}

					localStore.setFacePulseAnimated(animated);
				}
			),
		[facePulseApi, iteration1, iterationControls, localStore]
	);

	return (
		<S.AssistantLayer>
			<S.Layer>
				<S.AssistantFaceContainer ref={faceContainerResizeObserver.ref}>
					<S.AssistantFace style={assistantFaceStyle}>
						<S.AssistantFaceBackground>
							<Observer>
								{() => (
									<S.AssistantFacePulse
										style={
											localStore.facePulseAnimated
												? {
														scale: facePulseStyle.scale.to({
															range: [0, 0.25, 0.5, 0.75, 1],
															output: [1, 1.1, 1.05, 1.1, 1],
														}),
												  }
												: { scale: iteration1OpeningInterpolation }
										}
									/>
								)}
							</Observer>
							<S.AssistantFaceCircle>
								<svg viewBox={`0 0 ${CIRCLE_VIEW_BOX_SIZE} ${CIRCLE_VIEW_BOX_SIZE}`}>
									<a.circle
										cx={CIRCLE_CENTER}
										cy={CIRCLE_CENTER}
										r={CIRCLE_RADIUS}
										strokeDasharray={CIRCLE_CIRCUMFERENCE}
										strokeDashoffset={iteration1OpeningInterpolation.to((value) =>
											getCircleStrokeDashoffset(value * 100)
										)}
									/>
								</svg>
							</S.AssistantFaceCircle>
						</S.AssistantFaceBackground>
						<S.AssistantFaceContentLayer>
							<S.AssistantFaceVideoWrapper style={{ scale: iteration1OpeningInterpolation }}>
								<a.video
									src={getVideoByName("BasicGirlSource")}
									muted
									loop
									autoPlay
									playsInline
									style={{ scale: iteration1OpeningInterpolation.to((value) => 1 / value) }}
								/>
							</S.AssistantFaceVideoWrapper>
						</S.AssistantFaceContentLayer>
					</S.AssistantFace>
				</S.AssistantFaceContainer>
				<Observer>
					{() =>
						iterationControls.store.inRange(iteration1.start, iteration2.end) ? (
							<S.Description>
								<S.DescriptionContent>
									<Observer>
										{() =>
											iterationControls.store.inRange(iteration1.start, iteration1.end) ? (
												<SplitIntoChars text={["Let’s see how it works.", "Upload your content."]}>
													{({ char, absoluteIndex, count }) => (
														<a.span
															className='animated-inline-unit'
															style={{
																opacity: iterationControls.store.inRange(iteration1.start, iteration1.end)
																	? iteration1OpeningInterpolation.to((value) =>
																			iterationControls.range(value, absoluteIndex / count, 1)
																	  )
																	: iteration1ClosingInterpolation.to((value) => 1 - value),
															}}>
															{char}
														</a.span>
													)}
												</SplitIntoChars>
											) : null
										}
									</Observer>
								</S.DescriptionContent>
								<S.DescriptionContent>
									<Observer>
										{() =>
											iterationControls.store.inRange(iteration2.start, iteration2.end) ? (
												<SplitIntoChars text={["I’m here to organize it all", "into a neat structure"]}>
													{({ char, absoluteIndex, count }) => (
														<a.span
															className='animated-inline-unit'
															style={{
																opacity: iterationControls.store.inRange(iteration2.start, iteration2.center)
																	? iteration2OpeningInterpolation.to((value) =>
																			iterationControls.range(value, absoluteIndex / count, 1)
																	  )
																	: iteration2ClosingInterpolation.to((value) => 1 - value),
															}}>
															{char}
														</a.span>
													)}
												</SplitIntoChars>
											) : null
										}
									</Observer>
								</S.DescriptionContent>
							</S.Description>
						) : null
					}
				</Observer>
			</S.Layer>
		</S.AssistantLayer>
	);
};

function getCircleStrokeDashoffset(progress: number) {
	return ((100 - clamp(progress, 0, 100)) / 100) * CIRCLE_CIRCUMFERENCE;
}
