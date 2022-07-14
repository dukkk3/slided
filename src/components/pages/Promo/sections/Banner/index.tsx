import { useCallback, useEffect } from "react";
import { a, useSprings, useSpring } from "react-spring";
import { Observer } from "mobx-react-lite";
import { when } from "mobx";

import { AnimatedSplitWords } from "@components/pages/Promo/helpers/AnimatedSplitWords";

import { Iteration } from "@components/common/hoc/Iteration";

import { Button } from "@components/common/ui/Button";

import { interpolations } from "@core/helpers/iteration.helper";
import { resolveSpringAnimation } from "@core/helpers/animation.helper";
import { splitRowsIntoWords } from "@core/utils/common.utils";

import { usePromo } from "../../index";

import * as S from "./styled";

export const Banner: React.FC = () => {
	const promo = usePromo();
	const [buttonStyle, buttonStyleApi] = useSpring(() => ({ progress: 0 }));
	const [titleWordsStyles, titleWordsApi] = useSprings(TITLE_WORDS_AMOUNT, () => ({ progress: 0 }));

	const animate = useCallback(
		() =>
			Promise.all([
				resolveSpringAnimation(titleWordsApi, (index) => ({
					progress: 1,
					delay: index * 50,
				})),
				resolveSpringAnimation(buttonStyleApi, { progress: 1 }),
			]),
		[buttonStyleApi, titleWordsApi]
	);

	useEffect(
		() =>
			when(
				() => promo.store.canShowContent,
				() => animate().then(() => promo.store.setPromoBannerOpened(true))
			),
		[animate, promo]
	);

	return (
		<Iteration iterations={0}>
			{([iteration0]) => (
				<S.Banner data-iteration-name='Banner'>
					<div>
						<S.Head>
							<Observer>
								{() => (
									<S.TitleWrapper>
										<AnimatedSplitWords
											text={TITLE}
											opening={!promo.store.interactiveEnabled}
											getOpeningInterpolation={(index) => titleWordsStyles[index].progress}
											getClosingInterpolation={() =>
												iteration0.interpolations.closing.to(interpolations.easing("easeInOutCubic"))
											}
										/>
									</S.TitleWrapper>
								)}
							</Observer>
						</S.Head>
						<Observer>
							{() => (
								<a.div
									style={{
										y: (promo.store.interactiveEnabled
											? iteration0.interpolations.closing.to(interpolations.easing("easeInOutCubic"))
											: buttonStyle.progress.to(interpolations.invert)
										).to((value) => `-${2 * value}rem`),
										opacity: promo.store.interactiveEnabled
											? iteration0.interpolations.closing
													.to(interpolations.easing("easeInOutCubic"))
													.to(interpolations.invert)
											: buttonStyle.progress,
									}}>
									<Button size='m'>Get started</Button>
								</a.div>
							)}
						</Observer>
					</div>
				</S.Banner>
			)}
		</Iteration>
	);
};

const TITLE = ["Professionally", "designed presentations", "without effort"];
const TITLE_WORDS_AMOUNT = splitRowsIntoWords(TITLE).flat(Infinity).length;
