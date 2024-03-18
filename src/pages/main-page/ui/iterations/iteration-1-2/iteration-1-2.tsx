import { useUnit } from "effector-react";

import { springUtils } from "@shared/helpers";

import { IterationContainer } from "../../iteration-container";

import * as model from "./iteration-1-2.model";
import * as S from "./iteration-1-2.styled";

export const Iteration1_2 = () => {
	const isFirstTextOpening = !useUnit(model.$iteration1.opening.$ended);
	const isSecondTextOpening = !useUnit(model.$iteration2.opening.$ended);
	const [assistantInitialRef] = model.useAssistantShapeRect("initial");

	return (
		<IterationContainer>
			<S.AssistantSpeech>
				<S.AssistantWrapper ref={assistantInitialRef} />
				<S.DescriptionWrapper>
					<S.Description
						isOpening={isFirstTextOpening}
						words={["Let’s see how it works.", "Upload your content."]}
						openingProgress={model.iteration1.opening.progress.to(springUtils.toEase("easeInOutCubic"))}
						closingProgress={model.iteration1.closing.progress.to(springUtils.toEase("easeInOutCubic"))}
					/>
					<S.Description
						isOpening={isSecondTextOpening}
						words={["I’m here to organize it all", "into a neat structure"]}
						openingProgress={model.iteration2.opening.progress.to(springUtils.toEase("easeInOutCubic"))}
						closingProgress={model.iteration2.closing.progress.to(springUtils.toEase("easeInOutCubic"))}
					/>
				</S.DescriptionWrapper>
			</S.AssistantSpeech>
		</IterationContainer>
	);
};
