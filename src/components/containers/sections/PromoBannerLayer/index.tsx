import { a } from "react-spring";
import { Observer } from "mobx-react-lite";

import { SplitIntoWords } from "@components/common/simple/SplitIntoWords";

import { Button } from "@components/common/ui/Button";

import { useIterationControls } from "@core/hooks";

import * as S from "./styled";

export const PromoBannerLayer: React.FC = () => {
	const iterationControls = useIterationControls();
	const commonInterpolatedValue = iterationControls.animated.toRange(0, 0.5);

	return (
		<S.PromoBannerLayer>
			<Observer>
				{() =>
					iterationControls.store.inRange(0) ? (
						<div>
							<S.Head>
								<S.TitleWrapper>
									<SplitIntoWords text={["Professionally", "designed presentations", "without effort"]}>
										{({ word, absoluteIndex }) => (
											<a.span
												key={absoluteIndex}
												className='animated-inline-unit'
												style={{
													y: commonInterpolatedValue.to((value) => `-${100 * value}%`),
													opacity: commonInterpolatedValue.to((value) => 1 - value),
												}}>
												{word}
											</a.span>
										)}
									</SplitIntoWords>
								</S.TitleWrapper>
								<S.SubtitleWrapper>
									<SplitIntoWords text={["For the price of a coffee cup & croissant"]}>
										{({ word, absoluteIndex }) => (
											<a.span
												key={absoluteIndex}
												className='animated-inline-unit'
												style={{
													y: commonInterpolatedValue
														// .to((value) => iterationControls.range(value, absoluteIndex / count, 1))
														.to((value) => `-${100 * value}%`),
													opacity: commonInterpolatedValue.to((value) => 1 - value),
												}}>
												{word}
											</a.span>
										)}
									</SplitIntoWords>
								</S.SubtitleWrapper>
							</S.Head>
							<a.div
								style={{
									y: commonInterpolatedValue.to((value) => `-${100 * value}%`),
									opacity: commonInterpolatedValue.to((value) => 1 - value),
								}}>
								<Button size='m'>Get started</Button>
							</a.div>
						</div>
					) : null
				}
			</Observer>
		</S.PromoBannerLayer>
	);
};
