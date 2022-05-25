import { useCallback, useEffect } from "react";
import { a, useSprings, useSpring } from "react-spring";
import { Observer } from "mobx-react-lite";

import { SplitIntoWords } from "@components/common/simple/SplitIntoWords";

import { Button } from "@components/common/ui/Button";

import { useGlobalStore, useIteration } from "@core/hooks";
import { splitRowsIntoWords } from "@core/utils";

import * as S from "./styled";
import { animationHelper } from "@core/helpers";

export const PromoBannerLayer: React.FC = () => {
	const promoStore = useGlobalStore((store) => store.layout.promo);
	const [titleWordsStyles, titleWordsApi] = useSprings(titleWordsCount, () => ({
		y: "-100%",
		opacity: 0,
	}));
	const [subtitleWordsStyles, subtitleWordsApi] = useSprings(subtitleWordsCount, () => ({
		y: "-100%",
		opacity: 0,
	}));
	const [buttonStyle, buttonStyleApi] = useSpring(() => ({ opacity: 0, y: "-2rem" }));

	const {
		interpolations: [, iteration0ClosingInterpolation],
	} = useIteration(0);

	const animate = useCallback(async () => {
		await Promise.all([
			animationHelper.resolveSpringAnimation(titleWordsApi, (index) => ({
				y: "0%",
				opacity: 1,
				delay: index * 50,
			})),
			animationHelper.resolveSpringAnimation(subtitleWordsApi, (index) => ({
				y: "0%",
				opacity: 1,
				delay: index * 50,
			})),
			animationHelper.resolveSpringAnimation(buttonStyleApi, { y: "0rem", opacity: 1 }),
		]);

		promoStore.setPromoBannerOpeningAnimationEnded(true);
	}, [buttonStyleApi, promoStore, subtitleWordsApi, titleWordsApi]);

	useEffect(() => {
		animate();
	}, [animate]);

	return (
		<S.PromoBannerLayer>
			<div>
				<S.Head>
					<S.TitleWrapper>
						<Observer>
							{() => (
								<SplitIntoWords words={titleWords} rerenderFlag={promoStore.interactiveEnabled()}>
									{({ word, absoluteIndex }) => (
										<a.span
											key={absoluteIndex}
											className='animated-inline-unit'
											style={
												promoStore.interactiveEnabled()
													? {
															y: iteration0ClosingInterpolation.to((value) => `-${100 * value}%`),
															opacity: iteration0ClosingInterpolation.to((value) => 1 - value),
													  }
													: titleWordsStyles[absoluteIndex]
											}>
											{word}
										</a.span>
									)}
								</SplitIntoWords>
							)}
						</Observer>
					</S.TitleWrapper>
					<S.SubtitleWrapper>
						<Observer>
							{() => (
								<SplitIntoWords words={subtitleWords} rerenderFlag={promoStore.interactiveEnabled()}>
									{({ word, absoluteIndex }) => (
										<a.span
											key={absoluteIndex}
											className='animated-inline-unit'
											style={
												promoStore.interactiveEnabled()
													? {
															y: iteration0ClosingInterpolation.to((value) => `-${100 * value}%`),
															opacity: iteration0ClosingInterpolation.to((value) => 1 - value),
													  }
													: subtitleWordsStyles[absoluteIndex]
											}>
											{word}
										</a.span>
									)}
								</SplitIntoWords>
							)}
						</Observer>
					</S.SubtitleWrapper>
				</S.Head>
				<Observer>
					{() => (
						<a.div
							style={
								promoStore.interactiveEnabled()
									? {
											y: iteration0ClosingInterpolation.to((value) => `${-2 * value}rem`),
											opacity: iteration0ClosingInterpolation.to((value) => 1 - value),
									  }
									: buttonStyle
							}>
							<Button size='m'>Get started</Button>
						</a.div>
					)}
				</Observer>
			</div>
		</S.PromoBannerLayer>
	);
};

const titleWords = splitRowsIntoWords([
	"Professionally",
	"designed presentations",
	"without effort",
]);
const subtitleWords = splitRowsIntoWords(["For the price of a coffee cup & croissant"]);

const titleWordsCount = titleWords.flat(Infinity).length;
const subtitleWordsCount = subtitleWords.flat(Infinity).length;
