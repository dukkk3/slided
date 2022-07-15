import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/pages/Promo/helpers/Iteration";

import { VisibilitySwitch } from "@components/common/ui/VisibilitySwitch";

import { interpolations } from "@core/helpers/iteration.helper";

import { AnimatedSplitChars } from "../../helpers/AnimatedSplitChars";

import { usePromo } from "../../index";

import * as S from "./styled";

export const Assistant: React.FC = () => {
	const promo = usePromo();

	return (
		<Iteration
			iterations={[1, 2]}
			visibilitySwitch={{ unmountWhenInvisible: false }}
			checkForVisible={([iteration1, iteration2]) => iteration1.started() && !iteration2.ended()}>
			{() => (
				<S.Assistant data-iteration-name='Assistant'>
					<S.FaceWrapper ref={promo.transforms.bigAssistantAndPhoneAssistant.startRef} />
					<Iteration
						iterations={[1, 2]}
						checkForVisible={([iteration1, iteration2]) => iteration1.visible() || iteration2.visible()}
						visibilitySwitch={{ unmountWhenInvisible: false }}>
						{([iteration1, iteration2]) => (
							<S.DescriptionWrapper>
								<Observer>
									{() => (
										<VisibilitySwitch visible={iteration1.visible()} unmountWhenInvisible={false}>
											<S.Description>
												<AnimatedSplitChars
													text={["Let’s see how it works.", "Upload your content."]}
													openingInterpolation={iteration1.interpolations.opening.to(
														interpolations.easing("easeInOutCubic")
													)}
													closingInterpolation={iteration1.interpolations.closing.to(
														interpolations.easing("easeInOutCubic")
													)}
													type={iteration1.currentState()}
												/>
											</S.Description>
										</VisibilitySwitch>
									)}
								</Observer>
								<Observer>
									{() => (
										<VisibilitySwitch visible={iteration2.visible()} unmountWhenInvisible={false}>
											<S.Description>
												<AnimatedSplitChars
													text={["I’m here to organize it all", "into a neat structure"]}
													openingInterpolation={iteration2.interpolations.opening.to(
														interpolations.easing("easeInOutCubic")
													)}
													closingInterpolation={iteration2.interpolations.closing.to(
														interpolations.easing("easeInOutCubic")
													)}
													type={iteration2.currentState()}
												/>
											</S.Description>
										</VisibilitySwitch>
									)}
								</Observer>
							</S.DescriptionWrapper>
						)}
					</Iteration>
				</S.Assistant>
			)}
		</Iteration>
	);
};
