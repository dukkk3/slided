import { useCallback, useEffect, memo } from "react";
import { a, useSprings, useSpring } from "react-spring";
import { Observer } from "mobx-react-lite";

import { AnimatedSplitWords } from "@components/common/ordinary/AnimatedSplitWords";

import { Iteration } from "@components/common/hoc/Iteration";

import { Button } from "@components/common/ui/Button";

import { useGlobalStore } from "@core/hooks";
import { inlineSwitch, splitRowsIntoWords } from "@core/utils";
import { animationHelper } from "@core/helpers";

import * as S from "./styled";

export const Promo: React.FC = memo(() => {
	const promoStore = useGlobalStore((store) => store.layout.promo);
	const [titleWordsStyles, titleWordsApi] = useSprings(TITLE_WORDS_AMOUNT, () => ({ progress: 0 }));
	const [subtitleWordsStyles, subtitleWordsApi] = useSprings(SUBTITLE_WORDS_AMOUNT, () => ({
		progress: 0,
	}));
	const [buttonStyle, buttonStyleApi] = useSpring(() => ({ progress: 0 }));

	const animate = useCallback(async () => {
		await Promise.all([
			animationHelper.resolveSpringAnimation(titleWordsApi, (index) => ({
				progress: 1,
				delay: index * 50,
			})),
			animationHelper.resolveSpringAnimation(subtitleWordsApi, (index) => ({
				progress: 1,
				delay: index * 50,
			})),
			animationHelper.resolveSpringAnimation(buttonStyleApi, { progress: 1 }),
		]);

		promoStore.setPromoBannerOpeningAnimationEnded(true);
	}, [buttonStyleApi, promoStore, subtitleWordsApi, titleWordsApi]);

	useEffect(() => {
		animate();
	}, [animate]);

	return (
		<Iteration iteration={0}>
			{(iteration0) => (
				<S.Promo>
					<Observer>
						{() => (
							<div>
								<S.Head>
									<S.TitleWrapper>
										<AnimatedSplitWords
											content={TITLE}
											type={inlineSwitch(promoStore.interactiveEnabled(), "closing", "opening")}
											closingInterpolation={iteration0.interpolations.toEasing("easeInOutCubic").closing}
											getOpeningInterpolation={(index) => titleWordsStyles[index].progress}
										/>
									</S.TitleWrapper>
									<S.SubtitleWrapper>
										<AnimatedSplitWords
											content={SUBTITLE}
											type={inlineSwitch(promoStore.interactiveEnabled(), "closing", "opening")}
											closingInterpolation={iteration0.interpolations.toEasing("easeInOutCubic").closing}
											getOpeningInterpolation={(index) => subtitleWordsStyles[index].progress}
										/>
									</S.SubtitleWrapper>
								</S.Head>
								<a.div
									style={{
										y: inlineSwitch(
											promoStore.interactiveEnabled(),
											iteration0.interpolations.toEasing("easeInOutCubic").closing,
											buttonStyle.progress.to((value) => 1 - value)
										).to((value) => `-${2 * value}rem`),
										opacity: inlineSwitch(
											promoStore.interactiveEnabled(),
											iteration0.interpolations.toEasing("easeInOutCubic").closing.to((value) => 1 - value),
											buttonStyle.progress
										),
									}}>
									<Button size='m'>Get started</Button>
								</a.div>
							</div>
						)}
					</Observer>
				</S.Promo>
			)}
		</Iteration>
	);
});

const TITLE = ["Professionally", "designed presentations", "without effort"];
const SUBTITLE = ["For the price of a coffee cup & croissant"];

const TITLE_WORDS_AMOUNT = splitRowsIntoWords(TITLE).flat(Infinity).length;
const SUBTITLE_WORDS_AMOUNT = splitRowsIntoWords(SUBTITLE).flat(Infinity).length;
