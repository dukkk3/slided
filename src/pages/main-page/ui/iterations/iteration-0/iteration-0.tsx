import { animated, useSpring } from "@react-spring/web";
import { useUnit } from "effector-react";
import { useEffect } from "react";

import { interpolators, springUtils } from "@shared/helpers";
import { Button } from "@shared/ui";
import { common, math } from "@shared/utils";

import { IterationContainer } from "../../iteration-container";
import { TextAnimation } from "../../text-animation";

import * as model from "./iteration-0.model";
import * as S from "./iteration-0.styled";

export const Iteration0 = () => {
	const openingEnded = useUnit(model.$openingEnded);
	const interactiveEnabled = useUnit(model.$interactiveEnabled);
	const animationCanBePlayed = useUnit(model.$animationCanBePlayed);
	const [{ progress: openingProgress }, openingApi] = useSpring(() => ({ progress: 0 }));
	const [{ progress: interactiveProgress }, interactiveApi] = useSpring(() => ({ progress: 0 }));

	useEffect(() => {
		if (openingEnded || !animationCanBePlayed) return;
		openingApi.start({ from: { progress: 0 }, to: { progress: 1 }, config: { duration: 1000 } });
	}, [animationCanBePlayed, openingApi, openingEnded]);

	useEffect(() => {
		if (!interactiveEnabled) return;
		interactiveApi.start({ from: { progress: 0 }, to: { progress: 1 } });
	}, [interactiveApi, interactiveEnabled]);

	return (
		<IterationContainer>
			<S.Promo>
				<div>
					<S.Head>
						<S.TitleWrapper>
							<TextAnimation
								rowWrapper={S.Title}
								words={["Professionally", "designed presentations", "without effort"]}
								isOpening={!openingEnded}
								openingProgress={openingProgress.to(interpolators.toEased("easeInOutCubic"))}
								closingProgress={model.iteration0.closing.progress}
							/>
						</S.TitleWrapper>
					</S.Head>
					<animated.div
						style={springUtils.optimizeStyleForRendering({
							y: common
								.variant({
									if: openingEnded,
									then: model.iteration0.closing.progress,
									else: openingProgress.to(interpolators.toInverted),
								})
								.to(interpolators.toScaledOn(-20)),
							opacity: common.variant({
								if: openingEnded,
								then: model.iteration0.closing.progress
									.to(springUtils.toEase("easeInCubic"))
									.to(math.invert),
								else: openingProgress,
							}),
						})}>
						<Button size='m'>Get started</Button>
					</animated.div>
				</div>
				<S.MouseWrapper
					style={springUtils.optimizeStyleForRendering({
						opacity: common.variant({
							if: openingEnded,
							then: model.iteration0.closing.progress
								.to(interpolators.toEased("easeInOutCubic"))
								.to(interpolators.toInverted),
							else: interactiveProgress,
						}),
					})}>
					<S.Mouse />
				</S.MouseWrapper>
			</S.Promo>
		</IterationContainer>
	);
};
