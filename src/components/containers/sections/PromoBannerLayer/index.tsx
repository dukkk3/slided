import { useEffect, useCallback } from "react";
import { useAnimation, motion } from "framer-motion";
import { Observer } from "mobx-react-lite";

import { SplitIntoWords } from "@components/common/simple/SplitIntoWords";

import { Button } from "@components/common/ui/Button";

import { useGlobalStore, useLocalStore, useScroll } from "@core/hooks";
import { animationConfig } from "@core/config";

import * as S from "./styled";

export const PromoBannerLayer: React.FC = () => {
	const scroll = useScroll();
	const animationControls = useAnimation();
	const componentsAnimationsControls = useAnimation();
	const localStore = useLocalStore({ swapControls: false });
	const promoStore = useGlobalStore((store) => store.layout.promo);

	const animate = useCallback(async () => {
		await animationControls.start("active");
		localStore.setSwapControls(true);
		promoStore.setPromoBannerOpeningAnimationEnded(true);
	}, [animationControls, promoStore, localStore]);

	const handleScrollProgressChange = useCallback(() => {
		if (!scroll.enabled) return;

		const progress = scroll.animated.range(0, 0.5 / scroll.store.pages);

		componentsAnimationsControls.set({ y: `-${progress * 100}%`, opacity: 1 - progress });
	}, [componentsAnimationsControls, scroll]);

	useEffect(
		() => scroll.animated.progress.onChange(handleScrollProgressChange),
		[handleScrollProgressChange, scroll]
	);

	useEffect(() => {
		animate();
	}, [animate]);

	return (
		<S.PromoBannerLayer>
			<Observer>
				{() => (
					<motion.div animate={animationControls} initial='initial' variants={containerVariants}>
						<S.Head>
							<S.TitleWrapper>
								<SplitIntoWords text={["Professionally", "designed presentations", "without effort"]}>
									{({ word, absoluteIndex }) => (
										<motion.span
											key={absoluteIndex}
											className='animated-inline-unit'
											animate={localStore.swapControls && componentsAnimationsControls}
											variants={commonVariants}
											transition={animationConfig.defaultSpringTransition}>
											{word}
										</motion.span>
									)}
								</SplitIntoWords>
							</S.TitleWrapper>
							<S.SubtitleWrapper>
								<SplitIntoWords text={["For the price of a coffee cup & croissant"]}>
									{({ word, absoluteIndex }) => (
										<motion.span
											key={absoluteIndex}
											className='animated-inline-unit'
											animate={localStore.swapControls && componentsAnimationsControls}
											variants={commonVariants}
											transition={animationConfig.defaultSpringTransition}>
											{word}
										</motion.span>
									)}
								</SplitIntoWords>
							</S.SubtitleWrapper>
						</S.Head>
						<motion.div
							animate={localStore.swapControls && componentsAnimationsControls}
							variants={commonVariants}
							transition={animationConfig.defaultSpringTransition}>
							<Button size='m'>Get started</Button>
						</motion.div>
					</motion.div>
				)}
			</Observer>
		</S.PromoBannerLayer>
	);
};

const containerVariants = {
	active: {
		transition: {
			staggerChildren: 0.03,
			staggerDirection: 1,
		},
	},
};

const commonVariants = {
	initial: {
		opacity: 0,
		y: "-100%",
	},
	active: {
		opacity: 1,
		y: "0%",
	},
	exit: {
		opacity: 0,
		y: "-100%",
	},
};
