import { memo } from "react";
import { a } from "react-spring";
import { Observer } from "mobx-react-lite";

import { AnimatedSplitChars } from "@components/promo/AnimatedSplitChars";
import { ReadyTemplatesCards } from "@components/promo/ReadyTemplatesCards";
import { PhoneCard } from "@components/promo/PhoneCard";

import { VisibilitySwitch } from "@components/common/hoc/VisibilitySwitch";

import { Button } from "@components/common/ui/Button";

import { useIteration, useIterationControls } from "@core/hooks";

import { getRasterImageByName } from "@assets/images";

import * as S from "./styled";

export interface Props {
	templateCardRef?: React.ForwardedRef<any>;
	shiftedTemplateCardRef?: React.ForwardedRef<any>;
}

export const PhoneTemplates: React.FC<Props> = memo(
	({ templateCardRef, shiftedTemplateCardRef }) => {
		const iterationControls = useIterationControls();

		const iteration7 = useIteration(7);
		const iteration8 = useIteration(8);
		const iteration9 = useIteration(9);

		return (
			<a.div style={{ opacity: iteration9.interpolations.closing.to((value) => 1 - value) }}>
				<PhoneCard
					openingInterpolation={iteration7.interpolations.closing.to((value) =>
						iterationControls.toRange(value, 0.99, 1)
					)}
					backgroundZoomInterpolation={iteration7.interpolations.closing.to((value) =>
						iterationControls.toRange(value, 0.99, 1)
					)}
					hiddenContent>
					<S.DescriptionWrapper>
						<Observer>
							{() => (
								<VisibilitySwitch visible={iteration8.visible()}>
									<S.Description>
										<AnimatedSplitChars
											content={["You can", "track progress", "in real time on your phone"]}
											openingInterpolation={iteration8.interpolations.opening}
											closingInterpolation={iteration8.interpolations.closing}
											type={iteration8.visible("opening") ? "opening" : "closing"}
										/>
									</S.Description>
								</VisibilitySwitch>
							)}
						</Observer>
						<Observer>
							{() => (
								<VisibilitySwitch visible={iteration9.visible()}>
									<S.Description $overlay>
										<AnimatedSplitChars
											content={["Your", "presentation", "is done!"]}
											openingInterpolation={iteration9.interpolations.opening}
											closingInterpolation={iteration9.interpolations.closing}
											type={iteration9.visible("opening") ? "opening" : "closing"}
										/>
									</S.Description>
								</VisibilitySwitch>
							)}
						</Observer>
					</S.DescriptionWrapper>
					<S.CardsWrapper>
						<Observer>
							{() => (
								<ReadyTemplatesCards
									type={iteration9.startClosed() ? "closing" : "opening"}
									hideCardInterpolation={iteration9.interpolations.closing
										.to((value) => iterationControls.toRange(value, 0, 0.01))
										.to((value) => 1 - value)}
									hiddenTemplateRef={templateCardRef}
									shiftedHiddenTemplateRef={shiftedTemplateCardRef}
									hideScanLineInterpolation={iteration8.interpolations.closing
										.to((value) => iterationControls.toRange(value, 0.95, 1))
										.to((value) => 1 - value)}
									showHiddenLayerInterpolation={iteration8.interpolations.closing}
									shakeCardsInterpolation={iteration9.interpolations.opening}
									templates={[
										{ source: getRasterImageByName("CarTemplateSource") },
										{
											source: getRasterImageByName("BlueTemplateSource"),
											visibleLayerSource: getRasterImageByName("BrightTemplateSource"),
										},
										{ source: getRasterImageByName("BrightTemplateSource") },
										{ source: getRasterImageByName("BrightTemplateSource") },
										{ source: getRasterImageByName("BrightTemplateSource") },
									]}
								/>
							)}
						</Observer>
					</S.CardsWrapper>
					<S.ButtonWrapper
						style={{
							y: iteration9.interpolations.opening.to((value) => `${5 * (1 - value)}rem`),
							opacity: iteration9.interpolations.opening,
						}}>
						<Button>Download</Button>
					</S.ButtonWrapper>
				</PhoneCard>
			</a.div>
		);
	}
);
