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
		<S.Assistant {...(rest as any)}>
			<S.FaceWrapper ref={faceContainerRef} />
			<Iteration
				iteration={[1, 2]}
				visibleCondition={(iteration1, iteration2) => iteration1.started() && !iteration2.ended()}>
				{() => (
					<S.DescriptionWrapper>
						<Iteration iteration={1}>
							{(iteration1) => (
								<S.Description>
									<Observer>
										{() => (
											<AnimatedSplitChars
												content={["Let’s see how it works.", "Upload your content."]}
												openingInterpolation={iteration1.interpolations.toEasing("easeInOutCubic").opening}
												closingInterpolation={iteration1.interpolations.toEasing("easeInOutCubic").closing}
												type={iteration1.currentType()}
											/>
										)}
									</Observer>
								</S.Description>
							)}
						</Iteration>
						<Iteration iteration={2}>
							{(iteration2) => (
								<S.Description $overlay>
									<Observer>
										{() => (
											<AnimatedSplitChars
												content={["I’m here to organize it all", "into a neat structure"]}
												openingInterpolation={iteration2.interpolations.toEasing("easeInOutCubic").opening}
												closingInterpolation={iteration2.interpolations.toEasing("easeInOutCubic").closing}
												type={iteration2.currentType()}
											/>
										)}
									</Observer>
								</S.Description>
							)}
						</Iteration>
					</S.DescriptionWrapper>
				)}
			</Iteration>
		</S.Assistant>
	);
});
