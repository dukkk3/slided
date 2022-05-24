import { useEffect } from "react";
import { a } from "react-spring";
import { Observer } from "mobx-react-lite";
import { reaction } from "mobx";

import { SplitIntoChars } from "@components/common/simple/SplitIntoChars";

import { Image } from "@components/common/ui/Image";

import { useIterationControls, useIteration, useResizeObserver, useGlobalStore } from "@core/hooks";
import { calculateElementOffset } from "@core/utils";

import { getRasterImageByName } from "@assets/images";

import * as S from "./styled";

export const PhoneLayer: React.FC = () => {
	const iterationControls = useIterationControls();
	const faceContainerResizeObserver = useResizeObserver();
	const promoStore = useGlobalStore((store) => store.layout.promo);

	const {
		interpolations: [iteration3OpeningInterpolation],
		...iteration3
	} = useIteration(3);

	const {
		interpolations: [iteration4OpeningInterpolation],
		// ...iteration4
	} = useIteration(4);

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
		<Observer>
			{() => (
				<S.PhoneLayer
					style={
						iterationControls.store.compare(iteration3.start, "lte")
							? { opacity: 1, pointerEvents: "auto" }
							: { opacity: 0, pointerEvents: "none" }
					}>
					<S.Container>
						<S.Plug
							style={{
								y: iteration3OpeningInterpolation.to((value) => `-${50 * (1 - value)}%`),
								opacity: iteration3OpeningInterpolation,
							}}>
							<Image src={getRasterImageByName("Blue2TemplateSource")} lazy={false} />
						</S.Plug>
						<S.Content>
							<S.AssistantFaceContainer ref={faceContainerResizeObserver.ref} />
							<S.Description>
								<Observer>
									{() =>
										iterationControls.store.compare(iteration3.start, "lte") ? (
											<SplitIntoChars text={["Choose a style", "from ready-made", "templates"]}>
												{({ char, count, absoluteIndex }) => (
													<a.span
														className='animated-inline-unit'
														style={{
															opacity: iterationControls.store.compare(iteration3.start, "lte")
																? iteration3OpeningInterpolation.to((value) =>
																		iterationControls.range(value, absoluteIndex / count, 1)
																  )
																: iteration3OpeningInterpolation.to((value) => 1 - value),
														}}>
														{char}
													</a.span>
												)}
											</SplitIntoChars>
										) : null
									}
								</Observer>
							</S.Description>
							<Observer>
								{() =>
									iterationControls.store.compare(iteration3.start, "lte") ? (
										<S.CardsWrapper>
											{templates.map((templateSource, index) => {
												const { center, offset, sign, normalizedIndex } = getCardProps(index);

												return (
													<S.Card
														key={index}
														style={{
															translateZ: -5 * normalizedIndex,
															zIndex: center - offset,
															rotateY: -0.25 * normalizedIndex * sign,
															opacity: iteration3OpeningInterpolation,
															translateX: iterationControls.store.inRange(iteration3.start, iteration3.end)
																? iteration3OpeningInterpolation.to(
																		(value) =>
																			`${200 * normalizedIndex * sign + 120 * normalizedIndex * sign * (1 - value)}%`
																  )
																: iteration4OpeningInterpolation.to(
																		(value) => `${200 * normalizedIndex * sign * (1 - value)}%`
																  ),
															scale: iteration3OpeningInterpolation,
														}}>
														<Image src={templateSource} lazy={false} />
													</S.Card>
												);
											})}
										</S.CardsWrapper>
									) : null
								}
							</Observer>
						</S.Content>
					</S.Container>
				</S.PhoneLayer>
			)}
		</Observer>
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
