import { memo } from "react";
import { Observer } from "mobx-react-lite";

import { AnimatedSplitChars } from "@components/common/ordinary/AnimatedSplitChars";

import { Iteration } from "@components/common/hoc/Iteration";

import * as S from "./styled";

export interface Props extends React.ComponentProps<"div"> {
	faceContainerRef?: React.ForwardedRef<any>;
}

export const Assistant: React.FC<Props> = memo(({ faceContainerRef, ...rest }) => {
	return (
		<Iteration
			iterations={[1, 2]}
			checkForVisible={([iteration1, iteration2]) => iteration1.started() && !iteration2.ended()}>
			{() => (
				<S.Assistant {...(rest as any)}>
					<S.FaceWrapper ref={faceContainerRef} />
					<S.DescriptionWrapper>
						<Iteration iterations={1}>
							{([iteration1], interpolations) => (
								<S.Description>
									<Observer>
										{() => (
											<AnimatedSplitChars
												content={["Let’s see how it works.", "Upload your content."]}
												openingInterpolation={iteration1.interpolations.opening.to(
													interpolations.easing("easeInOutCubic")
												)}
												closingInterpolation={iteration1.interpolations.closing.to(
													interpolations.easing("easeInOutCubic")
												)}
												type={iteration1.currentState()}
											/>
										)}
									</Observer>
								</S.Description>
							)}
						</Iteration>
						<Iteration iterations={2}>
							{([iteration2], interpolations) => (
								<S.Description $overlay>
									<Observer>
										{() => (
											<AnimatedSplitChars
												content={["I’m here to organize it all", "into a neat structure"]}
												openingInterpolation={iteration2.interpolations.opening.to(
													interpolations.easing("easeInOutCubic")
												)}
												closingInterpolation={iteration2.interpolations.closing.to(
													interpolations.easing("easeInOutCubic")
												)}
												type={iteration2.currentState()}
											/>
										)}
									</Observer>
								</S.Description>
							)}
						</Iteration>
					</S.DescriptionWrapper>
				</S.Assistant>
			)}
		</Iteration>
	);
});
