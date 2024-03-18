import { animated } from "@react-spring/web";

import { springUtils } from "@shared/helpers";
import { Button } from "@shared/ui";
import { math } from "@shared/utils";

import { IterationContainer } from "../../iteration-container";
import { TextAnimation } from "../../text-animation";

import * as model from "./iteration-0.model";
import * as S from "./iteration-0.styled";

export const Iteration0 = () => {
	return (
		<IterationContainer>
			<S.Promo>
				<div>
					<S.Head>
						<S.TitleWrapper>
							<TextAnimation
								rowWrapper={S.Title}
								words={["Professionally", "designed presentations", "without effort"]}
								isOpening={false}
								closingProgress={model.iteration0.closing.progress}
							/>
						</S.TitleWrapper>
					</S.Head>
					<animated.div
						style={springUtils.optimizeStyleForRendering({
							y: model.iteration0.closing.progress.to((value) => -20 * value),
							opacity: model.iteration0.closing.progress
								.to(springUtils.toEase("easeInCubic"))
								.to(math.invert),
						})}>
						<Button size='m'>Get started</Button>
					</animated.div>
				</div>
			</S.Promo>
		</IterationContainer>
	);
};
