import { useCallback, useEffect, memo } from "react";
import { a, useSprings, useSpring } from "react-spring";
import { Observer } from "mobx-react-lite";
import { when } from "mobx";

import { AnimatedSplitWords } from "@components/common/ordinary/AnimatedSplitWords";

import { Iteration } from "@components/common/hoc/Iteration";

import { Button } from "@components/common/ui/Button";

import { useBreakpoint, useGlobalStore } from "@core/hooks";
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
	const breakpoint = useBreakpoint();

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

	useEffect(
		() =>
			when(
				() => promoStore.canShowContent,
				() => animate()
			),
		[animate, promoStore]
	);

	// useEffect(() => {
	// 	animate();
	// }, [animate]);

	return (
		<Iteration iterations={0}>
			{([iteration0], interpolations) => (
				<S.Promo>
					<Observer>
						{() => (
							<div>
								<S.Head>
									<S.TitleWrapper>
										<AnimatedSplitWords
											content={TITLE}
											type={inlineSwitch(promoStore.interactiveEnabled, "closing", "opening")}
											closingInterpolation={iteration0.interpolations.closing.to(
												interpolations.easing("easeInOutCubic")
											)}
											getOpeningInterpolation={(index) => titleWordsStyles[index].progress}
										/>
									</S.TitleWrapper>
									<S.SubtitleWrapper>
										<Observer>
											{() => (
												<AnimatedSplitWords
													content={breakpoint.range("mobile", "tablet") ? SUBTITLE_MOBILE : SUBTITLE}
													type={inlineSwitch(promoStore.interactiveEnabled, "closing", "opening")}
													closingInterpolation={iteration0.interpolations.closing.to(
														interpolations.easing("easeInOutCubic")
													)}
													getOpeningInterpolation={(index) => subtitleWordsStyles[index].progress}
												/>
											)}
										</Observer>
									</S.SubtitleWrapper>
								</S.Head>
								<a.div
									style={{
										y: inlineSwitch(
											promoStore.interactiveEnabled,
											iteration0.interpolations.closing.to(interpolations.easing("easeInOutCubic")),
											buttonStyle.progress.to(interpolations.invert)
										).to((value) => `-${2 * value}rem`),
										opacity: inlineSwitch(
											promoStore.interactiveEnabled,
											iteration0.interpolations.closing
												.to(interpolations.easing("easeInOutCubic"))
												.to(interpolations.invert),
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
const SUBTITLE_MOBILE = ["For the price of", "a coffee cup & croissant"];

const TITLE_WORDS_AMOUNT = splitRowsIntoWords(TITLE).flat(Infinity).length;
const SUBTITLE_WORDS_AMOUNT = splitRowsIntoWords(SUBTITLE).flat(Infinity).length;
