import { memo } from "react";
import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/common/hoc/Iteration";

import { Image } from "@components/common/ui/Image";

import { useTransformDifference } from "@core/hooks";
import { step } from "@core/utils";

import * as S from "./styled";

export interface Props {
	templateSource: string;
	startContainerRef?: React.RefObject<any>;
	endContainerRef?: React.RefObject<any>;
}

export const MovedGridTemplate: React.FC<Props> = memo(
	({ templateSource, startContainerRef, endContainerRef }) => {
		const transformBtwPhoneTemplateAndGridTemplate = useTransformDifference({
			startRef: startContainerRef,
			endRef: endContainerRef,
			resizeType: "rect",
		});

		return (
			<Iteration iteration={9} visibleCondition={(iteration9) => iteration9.visible("closing")}>
				{(iteration9) => (
					<Observer>
						{() => (
							<S.MovedGridTemplate
								style={{
									...transformBtwPhoneTemplateAndGridTemplate.startResizeObserver.getSize(),
									top: transformBtwPhoneTemplateAndGridTemplate.getStartOffset().top,
									left: transformBtwPhoneTemplateAndGridTemplate.getStartOffset().left,
									x: iteration9.interpolations
										.toEasing("easeInOutCubic")
										.closing.to((value) => transformBtwPhoneTemplateAndGridTemplate.getPosition().x * value),
									y: iteration9.interpolations
										.toEasing("easeInOutCubic")
										.closing.to((value) => transformBtwPhoneTemplateAndGridTemplate.getPosition().y * value),
									opacity: iteration9.interpolations
										.toEasing("easeInOutCubic")
										.closing.to((value) => step(value, 0.999))
										.to((value) => 1 - value),
								}}>
								<Image src={templateSource} lazy={false} />
							</S.MovedGridTemplate>
						)}
					</Observer>
				)}
			</Iteration>
		);
	}
);
