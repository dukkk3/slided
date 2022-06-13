import { memo, useEffect } from "react";
import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/common/hoc/Iteration";

import { Image } from "@components/common/ui/Image";

import { useIteration, useTransformDifference } from "@core/hooks";

import * as S from "./styled";
import { reaction } from "mobx";

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
			logging: true,
		});

		const iteration4 = useIteration(4);

		useEffect(
			() =>
				reaction(
					() => iteration4.visible("closing"),
					() => transformBtwStartEndContainers.calculate()
				),
			[iteration4, transformBtwStartEndContainers]
		);

		return (
			<Iteration
				iterations={[5, 8]}
				checkForVisible={([iteration5, iteration8]) => iteration5.opened() && !iteration8.started()}>
				{([iteration5], interpolations) => (
					<div>
						<Observer>
							{() => (
								<S.MovedExecutorFace
									style={{
										x: iteration5.interpolations.closing
											.to(interpolations.easing("easeInOutCubic"))
											.to(
												(value) =>
													value * transformBtwStartEndContainers.getPosition().x -
													(transformBtwStartEndContainers.endResizeObserver.getSize().width -
														transformBtwStartEndContainers.startResizeObserver.getSize().width) /
														2
											),
										y: iteration5.interpolations.closing
											.to(interpolations.easing("easeInOutCubic"))
											.to(
												(value) =>
													value * transformBtwStartEndContainers.getPosition().y -
													(transformBtwStartEndContainers.endResizeObserver.getSize().height -
														transformBtwStartEndContainers.startResizeObserver.getSize().height) /
														2
											),
										scaleX: iteration5.interpolations.closing
											.to(interpolations.easing("easeInOutCubic"))
											.to((value) => 1 - (1 - 1 / transformBtwStartEndContainers.getScale().x) * (1 - value)),
										scaleY: iteration5.interpolations.closing
											.to(interpolations.easing("easeInOutCubic"))
											.to((value) => 1 - (1 - 1 / transformBtwStartEndContainers.getScale().y) * (1 - value)),
										...transformBtwStartEndContainers.endResizeObserver.getSize(),
										...transformBtwStartEndContainers.getStartOffset(),
									}}>
									<Image src={avatarSource} lazy={false} />
								</S.MovedExecutorFace>
							)}
						</Observer>
					</div>
				)}
			</Iteration>
		);
	}
);
