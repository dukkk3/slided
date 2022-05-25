import { useEffect } from "react";
import { Observer } from "mobx-react-lite";
import { a } from "react-spring";
import { reaction } from "mobx";

import { SplitIntoChars } from "@components/common/simple/SplitIntoChars";

import { Image } from "@components/common/ui/Image";
import { Button } from "@components/common/ui/Button";

import { useIterationControls, useIteration, useResizeObserver, useGlobalStore } from "@core/hooks";
import { calculateElementOffset } from "@core/utils";

import { getRasterImageByName } from "@assets/images";

import * as S from "./styled";

export const PhoneLayer: React.FC = () => {
	const iterationControls = useIterationControls();
	const faceContainerResizeObserver = useResizeObserver();
	const promoStore = useGlobalStore((store) => store.layout.promo);

	const {
		interpolations: [iteration3OpeningInterpolation, iteration3ClosingInterpolation],
		...iteration3
	} = useIteration(3);

	const {
		interpolations: [iteration4OpeningInterpolation, iteration4ClosingInterpolation],
		...iteration4
	} = useIteration(4);

	const {
		interpolations: [iteration5OpeningInterpolation],
		...iteration5
	} = useIteration(5);

	useEffect(
		() =>
			reaction(
				() => faceContainerResizeObserver.getSize(),
				(size) => {
					const faceContainerOffset = calculateElementOffset(faceContainerResizeObserver.ref.current);
					promoStore.setEndPointFaceOffset(faceContainerOffset);
					promoStore.setEndPointFaceContainerSize(size);
				}
			),
		[faceContainerResizeObserver, promoStore]
	);

	return (
		<S.PhoneLayer>
			<S.Container>
				<S.Plug
					className='safari-border-radius-overflow-bugfix'
					style={{
						y: iteration3OpeningInterpolation.to((value) => `-${50 * (1 - value)}%`),
						opacity: iteration3OpeningInterpolation,
					}}>
					<S.PlugImageWrapper
						style={{
							translateX: "-35%",
							scale: iteration4OpeningInterpolation.to((value) => 1 + 2 * (1 - value)),
							opacity: iteration4OpeningInterpolation.to((value) => 0.2 * value),
						}}>
						<Image src={getRasterImageByName("Blue2TemplateSource")} lazy={false} />
					</S.PlugImageWrapper>
					<S.PlugImageWrapper
						style={{
							translateX: "-38%",
							scale: iteration4OpeningInterpolation.to((value) => 1.8 + 8 * (1 - value)),
							opacity: iteration4OpeningInterpolation.to((value) => 0.3 * value),
						}}>
						<Image src={getRasterImageByName("Blue2TemplateSource")} lazy={false} />
					</S.PlugImageWrapper>
				</S.Plug>
				<S.Content>
					<S.AssistantFaceContainer ref={faceContainerResizeObserver.ref} />
					<S.Description>
						<Observer>
							{() => (
								<div
									style={
										!iterationControls.store.inRange(iteration3.start, iteration4.end)
											? { pointerEvents: "none", opacity: 0 }
											: {}
									}>
									<SplitIntoChars
										text={["Choose a style", "from ready-made", "templates"]}
										rerenderFlag={iterationControls.store.inRange(iteration3.start, iteration4.center)}>
										{({ char, count, absoluteIndex }) => (
											<a.span
												style={{
													opacity: iterationControls.store.inRange(iteration3.start, iteration4.center)
														? iteration3OpeningInterpolation.to((value) =>
																iterationControls.range(value, absoluteIndex / count, 1)
														  )
														: iteration4ClosingInterpolation.to((value) => 1 - value),
												}}>
												{char}
											</a.span>
										)}
									</SplitIntoChars>
								</div>
							)}
						</Observer>
						<Observer>
							{() => (
								<S.DescriptionOverlayContent
									style={
										iterationControls.store.compare(iteration5.start, "gt")
											? { pointerEvents: "none", opacity: 0 }
											: {}
									}>
									<SplitIntoChars
										text={["Our selected", "designers are on", "the mission to get", "your task done"]}>
										{({ char, count, absoluteIndex }) => (
											<a.span
												style={{
													opacity: iteration5OpeningInterpolation.to((value) =>
														iterationControls.range(value, absoluteIndex / count, 1)
													),
												}}>
												{char}
											</a.span>
										)}
									</SplitIntoChars>
								</S.DescriptionOverlayContent>
							)}
						</Observer>
					</S.Description>
					<Observer>
						{() => (
							<S.CardsWrapper
								style={
									iterationControls.store.compare(iteration3.start, "gt")
										? { pointerEvents: "none", opacity: 0 }
										: {
												opacity: iterationControls.animated
													.toRange(iteration4.center + 0.1, iteration4.end)
													.to((value) => 1 - value),
												y: iterationControls.animated
													.toRange(iteration4.center + 0.1, iteration4.end)
													.to((value) => `${5 * value}rem`),
										  }
								}>
								{templates.map((templateSource, index) => {
									const { center, offset, sign, normalizedIndex } = getCardProps(index);

									return (
										<S.Card
											key={index}
											className='safari-border-radius-overflow-bugfix'
											style={{
												translateZ: -5 * normalizedIndex,
												zIndex: center - offset,
												rotateY: iteration3ClosingInterpolation.to(
													(value) => -0.25 * normalizedIndex * sign * (1 - value)
												),
												opacity: iteration3OpeningInterpolation,
												translateX: iterationControls.store.inRange(iteration3.start, iteration3.center)
													? iteration3OpeningInterpolation.to(
															(value) =>
																`${200 * normalizedIndex * sign + 120 * normalizedIndex * sign * (1 - value)}%`
													  )
													: iteration3ClosingInterpolation.to(
															(value) => `${200 * normalizedIndex * sign * (1 - value)}%`
													  ),
												scale: iteration3OpeningInterpolation,
											}}>
											<S.CardImageWrapper
												style={{
													scale:
														index === center
															? iteration4OpeningInterpolation.to((value) => 1 + 0.4 * (1 - value))
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
					<Observer>
						{() => (
							<S.ButtonWrapper
								style={{
									opacity: iterationControls.store.compare(iteration4.center, "gte")
										? iteration4OpeningInterpolation
										: iterationControls.animated
												.toRange(iteration4.center, iteration4.end - 0.1)
												.to((value) => 1 - value),
									y: iterationControls.animated
										.toRange(iteration4.center, iteration4.end - 0.1)
										.to((value) => `${5 * value}rem`),
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
