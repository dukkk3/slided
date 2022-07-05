import { useCallback, useEffect } from "react";
import { a, useSprings, useSpring } from "react-spring";
import { Observer } from "mobx-react-lite";
import { when } from "mobx";

import { AnimatedSplitWords } from "@components/common/ordinary/AnimatedSplitWords";

import { Iteration } from "@components/common/hoc/Iteration";

import { Button } from "@components/common/ui/Button";

import { useGlobalStore } from "@core/hooks/useGlobalStore";
import { interpolations } from "@core/helpers/iteration.helper";
import { resolveSpringAnimation } from "@core/helpers/animation.helper";
import { splitRowsIntoWords } from "@core/utils/common.utils";

import * as S from "./styled";

export const Promo: React.FC = () => {
	const promoStore = useGlobalStore((store) => store.layout.promo);
	const [titleWordsStyles, titleWordsApi] = useSprings(TITLE_WORDS_AMOUNT, () => ({ progress: 0 }));
	const [buttonStyle, buttonStyleApi] = useSpring(() => ({ progress: 0 }));

	const animate = useCallback(async () => {
		await Promise.all([
			resolveSpringAnimation(titleWordsApi, (index) => ({
				progress: 1,
				delay: index * 50,
			})),
			resolveSpringAnimation(buttonStyleApi, { progress: 1 }),
		]);

		promoStore.setPromoBannerOpeningAnimationEnded(true);
	}, [buttonStyleApi, promoStore, titleWordsApi]);

	useEffect(
		() =>
			when(
				() => promoStore.canShowContent,
				() => animate()
			),
		[animate, promoStore]
	);

	return (
		<Iteration iterations={0}>
			{([iteration0]) => (
				<S.Promo>
					<Observer>
						{() => (
							<div>
								<S.Head>
									<S.TitleWrapper>
										<AnimatedSplitWords
											content={TITLE}
											type={promoStore.interactiveEnabled ? "closing" : "opening"}
											closingInterpolation={iteration0.interpolations.closing.to(
												interpolations.easing("easeInOutCubic")
											)}
											getOpeningInterpolation={(index) => titleWordsStyles[index].progress}
										/>
									</S.TitleWrapper>
									{/* <S.SubtitleWrapper>
										<Observer>
											{() => (
												<AnimatedSplitWords
													content={breakpoint.mobile() ? SUBTITLE_MOBILE : SUBTITLE}
													type={promoStore.interactiveEnabled ? "closing" : "opening"}
													closingInterpolation={iteration0.interpolations.closing.to(
														interpolations.easing("easeInOutCubic")
													)}
													getOpeningInterpolation={(index) => subtitleWordsStyles[index].progress}
												/>
											)}
										</Observer>
									</S.SubtitleWrapper> */}
								</S.Head>
								<a.div
									style={{
										y: (promoStore.interactiveEnabled
											? iteration0.interpolations.closing.to(interpolations.easing("easeInOutCubic"))
											: buttonStyle.progress.to(interpolations.invert)
										).to((value) => `-${2 * value}rem`),
										opacity: promoStore.interactiveEnabled
											? iteration0.interpolations.closing
													.to(interpolations.easing("easeInOutCubic"))
													.to(interpolations.invert)
											: buttonStyle.progress,
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
};

const TITLE = ["Professionally", "designed presentations", "without effort"];
const TITLE_WORDS_AMOUNT = splitRowsIntoWords(TITLE).flat(Infinity).length;
