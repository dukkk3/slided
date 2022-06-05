import { Observer } from "mobx-react-lite";

import { AnimatedSplitChars } from "@components/promo/AnimatedSplitChars";

import { VisibilitySwitch } from "@components/common/hoc/VisibilitySwitch";

import { useIteration } from "@core/hooks";

import * as S from "./styled";

export interface Props extends React.ComponentProps<"div"> {
	faceWrapperRef?: React.ForwardedRef<any>;
	renderFace: () => React.ReactNode;
}

export const Assistant: React.FC<Props> = ({ faceWrapperRef, renderFace, ...rest }) => {
	const iteration0 = useIteration(0);
	const iteration1 = useIteration(1);
	const iteration2 = useIteration(2);

	return (
		<S.Assistant {...(rest as any)}>
			<S.FaceWrapper ref={faceWrapperRef}>{renderFace()}</S.FaceWrapper>
			<Observer>
				{() => (
					<VisibilitySwitch
						visible={iteration0.visible("closing") || iteration1.visible() || iteration2.visible()}>
						<S.DescriptionWrapper>
							<Observer>
								{() => (
									<VisibilitySwitch visible={iteration1.visible()}>
										<div>
											<AnimatedSplitChars
												content={["Let’s see how it works.", "Upload your content."]}
												openingInterpolation={iteration1.interpolations.opening}
												closingInterpolation={iteration1.interpolations.closing}
												type={iteration1.visible("opening") ? "opening" : "closing"}
											/>
										</div>
									</VisibilitySwitch>
								)}
							</Observer>
							<Observer>
								{() => (
									<VisibilitySwitch visible={iteration2.visible()}>
										<div style={{ top: 0, left: 0, width: "100%", position: "absolute" }}>
											<AnimatedSplitChars
												content={["I’m here to organize it all", "into a neat structure"]}
												openingInterpolation={iteration2.interpolations.opening}
												closingInterpolation={iteration2.interpolations.closing}
												type={iteration2.visible("opening") ? "opening" : "closing"}
											/>
										</div>
									</VisibilitySwitch>
								)}
							</Observer>
						</S.DescriptionWrapper>
					</VisibilitySwitch>
				)}
			</Observer>
		</S.Assistant>
	);
};
