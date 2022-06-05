import { useCallback, useEffect, memo } from "react";
import { a, useSprings, useSpring } from "react-spring";
import { Observer } from "mobx-react-lite";

import { AnimatedSplitWords } from "@components/promo/AnimatedSplitWords";

import { Button } from "@components/common/ui/Button";

import { useGlobalStore, useIteration } from "@core/hooks";
import { splitRowsIntoWords } from "@core/utils";
import { animationHelper } from "@core/helpers";

import * as S from "./styled";

export const Promo: React.FC = memo(() => {
	const promoStore = useGlobalStore((store) => store.layout.promo);
	const [titleWordsStyles, titleWordsApi] = useSprings(TITLE_WORDS_AMOUNT, () => ({ progress: 0 }));
	const [subtitleWordsStyles, subtitleWordsApi] = useSprings(SUBTITLE_WORDS_AMOUNT, () => ({
		progress: 0,
	}));
	const [buttonStyle, buttonStyleApi] = useSpring(() => ({ progress: 0 }));

	const iteration0 = useIteration(0);

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
		<S.Promo>
			<div>
				<S.Head>
					<S.TitleWrapper>
						<Observer>
							{() => (
								<AnimatedSplitWords
									content={TITLE}
									type={!promoStore.interactiveEnabled() ? "opening" : "closing"}
									closingInterpolation={iteration0.interpolations.closing}
									getOpeningInterpolation={(index) => titleWordsStyles[index].progress}
								/>
							)}
						</Observer>
					</S.TitleWrapper>
					<S.SubtitleWrapper>
						<Observer>
							{() => (
								<AnimatedSplitWords
									content={SUBTITLE}
									type={!promoStore.interactiveEnabled() ? "opening" : "closing"}
									closingInterpolation={iteration0.interpolations.closing}
									getOpeningInterpolation={(index) => subtitleWordsStyles[index].progress}
								/>
							)}
						</Observer>
					</S.SubtitleWrapper>
				</S.Head>
				<Observer>
					{() => (
						<a.div
							style={{
								y: (promoStore.interactiveEnabled()
									? iteration0.interpolations.closing
									: buttonStyle.progress.to((value) => 1 - value)
								).to((value) => `-${2 * value}rem`),
								opacity: promoStore.interactiveEnabled()
									? iteration0.interpolations.closing.to((value) => 1 - value)
									: buttonStyle.progress,
							}}>
							<Button size='m'>Get started</Button>
						</a.div>
					)}
				</Observer>
			</div>
		</S.Promo>
	);
});

const TITLE = ["Professionally", "designed presentations", "without effort"];
const SUBTITLE = ["For the price of a coffee cup & croissant"];

const TITLE_WORDS_AMOUNT = splitRowsIntoWords(TITLE).flat(Infinity).length;
const SUBTITLE_WORDS_AMOUNT = splitRowsIntoWords(SUBTITLE).flat(Infinity).length;
