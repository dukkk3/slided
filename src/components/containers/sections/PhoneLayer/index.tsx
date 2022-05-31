import { useEffect } from "react";
import { Observer } from "mobx-react-lite";
import { a } from "react-spring";
import { reaction } from "mobx";

import { VisibleIterationRange } from "@components/common/hoc/VisibleIterationRange";

import { SplitIntoChars } from "@components/common/simple/SplitIntoChars";

import { Image } from "@components/common/ui/Image";
import { Button } from "@components/common/ui/Button";

import { useIterationControls, useIteration, useResizeObserver, useGlobalStore } from "@core/hooks";
import { calculateElementOffset } from "@core/utils";

import { getRasterImageByName } from "@assets/images";

import * as S from "./styled";

export const PhoneLayer: React.FC = () => {
	const iterationControls = useIterationControls();
	const minFaceResizeObserver = useResizeObserver();
	const executorFaceResizeObserver = useResizeObserver();
	const minFaceWithExecutorResizeObserver = useResizeObserver();
	const promoStore = useGlobalStore((store) => store.layout.promo);

	const iteration3 = useIteration(3);
	const iteration4 = useIteration(4);
	const iteration5 = useIteration(5);
	const iteration6 = useIteration(6);

	useEffect(
		() =>
			reaction(
				() => executorFaceResizeObserver.getSize(),
				(size) => {
					const offset = calculateElementOffset(executorFaceResizeObserver.ref.current);
					promoStore.setExecutorFaceStyles({ ...size, ...offset });
				}
			),
		[executorFaceResizeObserver, promoStore]
	);

	useEffect(
		() =>
			reaction(
				() => minFaceWithExecutorResizeObserver.getSize(),
				(size) => {
					const offset = calculateElementOffset(minFaceWithExecutorResizeObserver.ref.current);
					promoStore.setMinFaceWithExecutorStyles({ ...size, ...offset });
				}
			),
		[minFaceWithExecutorResizeObserver, promoStore]
	);

	useEffect(
		() =>
			reaction(
				() => minFaceResizeObserver.getSize(),
				(size) => {
					const offset = calculateElementOffset(minFaceResizeObserver.ref.current);
					promoStore.setMinFaceStyles({ ...size, ...offset });
				}
			),
		[minFaceResizeObserver, promoStore]
	);

	return (
		<S.PhoneLayer>
			<S.Container>
				<S.Plug
					className='safari-border-radius-overflow-bugfix'
					style={{
						y: iteration3.interpolations.opening.to((value) => `-${50 * (1 - value)}%`),
						opacity: iteration3.interpolations.opening,
					}}>
					<S.PlugImageWrapper
						style={{
							translateX: "-35%",
							scale: iteration4.interpolations.opening.to((value) => 1 + 2 * (1 - value)),
							opacity: iteration4.interpolations.opening.to((value) => 0.2 * value),
						}}>
						<Image src={getRasterImageByName("Blue2TemplateSource")} lazy={false} />
					</S.PlugImageWrapper>
					<S.PlugImageWrapper
						style={{
							translateX: "-38%",
							scale: iteration4.interpolations.opening.to((value) => 1.8 + 8 * (1 - value)),
							opacity: iteration4.interpolations.opening.to((value) => 0.3 * value),
						}}>
						<Image src={getRasterImageByName("Blue2TemplateSource")} lazy={false} />
					</S.PlugImageWrapper>
				</S.Plug>
				<S.Content>
					<S.AssistantFaceGroup>
						<S.AssistantFaceContainer ref={minFaceResizeObserver.ref} />
						<S.AssistantFaceContainer
							ref={minFaceWithExecutorResizeObserver.ref}
							style={{ transform: "translateX(-40%)" }}
						/>
						<S.AssistantFaceContainer
							ref={executorFaceResizeObserver.ref}
							style={{ transform: "translateX(40%)" }}
						/>
					</S.AssistantFaceGroup>
					<S.Description>
						<VisibleIterationRange start={iteration3.start} end={iteration4.end}>
							<div>
								<Observer>
									{() => (
										<SplitIntoChars
											text={["Choose a style", "from ready-made", "templates"]}
											rerenderFlag={iterationControls.store.inRange(
												iteration3.start,
												iteration4.fromStartCenter
											)}>
											{({ char, count, absoluteIndex }) => (
												<a.span
													style={{
														opacity: iterationControls.store.inRange(iteration3.start, iteration4.fromStartCenter)
															? iteration3.interpolations.opening.to((value) =>
																	iterationControls.range(value, absoluteIndex / count, 1)
															  )
															: iteration4.interpolations.closing.to((value) => 1 - value),
													}}>
													{char}
												</a.span>
											)}
										</SplitIntoChars>
									)}
								</Observer>
							</div>
						</VisibleIterationRange>
						<VisibleIterationRange conditionFN={() => iteration5.visible()}>
							<S.DescriptionOverlayContent>
								<Observer>
									{() => (
										<SplitIntoChars
											text={["Our selected", "designers are on", "the mission to get", "your task done"]}
											rerenderFlag={iterationControls.store.inRange(
												iteration5.start,
												iteration5.fromStartCenter
											)}>
											{({ char, count, absoluteIndex }) => (
												<a.span
													style={{
														opacity: iterationControls.store.inRange(iteration5.start, iteration5.fromStartCenter)
															? iteration5.interpolations.opening.to((value) =>
																	iterationControls.range(value, absoluteIndex / count, 1)
															  )
															: iteration5.interpolations.closing.to((value) => 1 - value),
													}}>
													{char}
												</a.span>
											)}
										</SplitIntoChars>
									)}
								</Observer>
							</S.DescriptionOverlayContent>
						</VisibleIterationRange>
						<VisibleIterationRange conditionFN={() => iteration6.visible()}>
							<S.DescriptionOverlayContentBig>
								<Observer>
									{() => (
										<SplitIntoChars
											text={["Slide it to", "make it"]}
											rerenderFlag={iterationControls.store.inRange(
												iteration6.start,
												iteration6.fromStartCenter
											)}>
											{({ char, count, absoluteIndex }) => (
												<a.span
													style={{
														opacity: iterationControls.store.inRange(iteration6.start, iteration6.fromStartCenter)
															? iteration6.interpolations.opening.to((value) =>
																	iterationControls.range(value, absoluteIndex / count, 1)
															  )
															: iteration6.interpolations.closing.to((value) => 1 - value),
													}}>
													{char}
												</a.span>
											)}
										</SplitIntoChars>
									)}
								</Observer>
							</S.DescriptionOverlayContentBig>
						</VisibleIterationRange>
					</S.Description>
					<VisibleIterationRange
						conditionFN={() => !iterationControls.store.compare(iteration3.start, "gt")}>
						<Observer>
							{() => (
								<S.CardsWrapper
									style={{
										opacity: iteration4.interpolations.closing.to((value) => 1 - value),
										y: iteration4.interpolations.closing.to((value) => `${5 * value}rem`),
									}}>
									{templates.map((templateSource, index) => {
										const { center, offset, sign, normalizedIndex } = getCardProps(index);

										return (
											<S.Card
												key={index}
												className='safari-border-radius-overflow-bugfix'
												style={{
													translateZ: -5 * normalizedIndex,
													zIndex: center - offset,
													rotateY: iteration3.interpolations.closing.to(
														(value) => -0.25 * normalizedIndex * sign * (1 - value)
													),
													opacity: iteration3.interpolations.opening,
													translateX: iterationControls.store.inRange(
														iteration3.start,
														iteration3.fromStartCenter
													)
														? iteration3.interpolations.opening.to(
																(value) =>
																	`${200 * normalizedIndex * sign + 120 * normalizedIndex * sign * (1 - value)}%`
														  )
														: iteration3.interpolations.closing.to(
																(value) => `${200 * normalizedIndex * sign * (1 - value)}%`
														  ),
													scale: iteration3.interpolations.opening,
												}}>
												<S.CardImageWrapper
													style={{
														scale:
															index === center
																? iteration4.interpolations.opening.to((value) => 1 + 0.4 * (1 - value))
																: undefined,
													}}>
													<Image src={templateSource} lazy={false} />
												</S.CardImageWrapper>
											</S.Card>
										);
									})}
								</S.CardsWrapper>
							)}
						</Observer>
					</VisibleIterationRange>
					<Observer>
						{() => (
							<S.ButtonWrapper
								style={{
									opacity: iterationControls.store.compare(iteration4.center, "gte")
										? iteration4.interpolations.opening
										: iteration4.interpolations.closing.to((value) => 1 - value),
									y: iteration4.interpolations.closing.to((value) => `${5 * value}rem`),
								}}>
								<Button size='m'>Choose</Button>
							</S.ButtonWrapper>
						)}
					</Observer>
				</S.Content>
			</S.Container>
		</S.PhoneLayer>
	);
};

const templates = [
	getRasterImageByName("BeigeTemplateSource"),
	getRasterImageByName("BrightTemplateSource"),
	getRasterImageByName("BlueTemplateSource"),
	getRasterImageByName("GreenTemplateSource"),
	getRasterImageByName("SilverTemplateSource"),
];

const TEMPLATES_COUNT = templates.length;

function getCardProps(index: number) {
	const center = Math.ceil(TEMPLATES_COUNT / 2) - 1;
	const offset = Math.abs(index - center);
	const sign = Math.sign(index - center);
	const normalizedIndex = offset / center;
	return { center, offset, sign, normalizedIndex };
}
