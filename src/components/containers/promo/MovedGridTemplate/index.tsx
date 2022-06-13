import { memo } from "react";
import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/common/hoc/Iteration";

import { Image } from "@components/common/ui/Image";

import { useTransformDifference } from "@core/hooks";

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
			<Iteration iterations={9} checkForVisible={([iteration9]) => iteration9.visible("closing")}>
				{([iteration9], interpolations) => (
					<div>
						<Observer>
							{() => (
								<S.MovedGridTemplate
									style={{
										...transformBtwPhoneTemplateAndGridTemplate.startResizeObserver.getSize(),
										top: transformBtwPhoneTemplateAndGridTemplate.getStartOffset().top,
										left: transformBtwPhoneTemplateAndGridTemplate.getStartOffset().left,
										x: iteration9.interpolations.closing
											.to(interpolations.easing("easeInOutCubic"))
											.to((value) => transformBtwPhoneTemplateAndGridTemplate.getPosition().x * value),
										y: iteration9.interpolations.closing
											.to(interpolations.easing("easeInOutCubic"))
											.to((value) => transformBtwPhoneTemplateAndGridTemplate.getPosition().y * value),
										opacity: iteration9.interpolations.closing
											.to(interpolations.easing("easeInOutCubic"))
											.to(interpolations.step(1))
											.to(interpolations.invert),
									}}>
									<Image src={templateSource} lazy={false} />
								</S.MovedGridTemplate>
							)}
						</Observer>
					</div>
				)}
			</Iteration>
		);
	}
);
