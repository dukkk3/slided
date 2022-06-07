import { memo } from "react";
import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/common/hoc/Iteration";

import { Image } from "@components/common/ui/Image";

import { useTransformDifference } from "@core/hooks";

import * as S from "./styled";

export interface Props {
	avatarSource: string;
	startContainerRef?: React.RefObject<any>;
	endContainerRef?: React.RefObject<any>;
}

export const MovedExecutorFace: React.FC<Props> = memo(
	({ avatarSource, startContainerRef, endContainerRef }) => {
		const transformBtwStartEndContainers = useTransformDifference({
			startRef: startContainerRef,
			endRef: endContainerRef,
		});

		return (
			<Iteration
				iteration={[5, 8]}
				visibleCondition={(iteration5, iteration8) => iteration5.opened() && !iteration8.started()}>
				{(iteration5) => (
					<Observer>
						{() => (
							<S.MovedExecutorFace
								style={{
									x: iteration5.interpolations
										.toEasing("easeInOutCubic")
										.closing.to((value) => value * transformBtwStartEndContainers.getPosition().x),
									y: iteration5.interpolations
										.toEasing("easeInOutCubic")
										.closing.to((value) => value * transformBtwStartEndContainers.getPosition().y),
									scaleX: iteration5.interpolations
										.toEasing("easeInOutCubic")
										.closing.to((value) => 1 + (transformBtwStartEndContainers.getScale().x - 1) * value),
									scaleY: iteration5.interpolations
										.toEasing("easeInOutCubic")
										.closing.to((value) => 1 + (transformBtwStartEndContainers.getScale().y - 1) * value),
									...transformBtwStartEndContainers.startResizeObserver.getSize(),
									...transformBtwStartEndContainers.getStartOffset(),
								}}>
								<Image src={avatarSource} lazy={false} />
							</S.MovedExecutorFace>
						)}
					</Observer>
				)}
			</Iteration>
		);
	}
);
