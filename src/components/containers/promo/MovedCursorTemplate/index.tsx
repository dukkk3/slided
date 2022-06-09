import { memo } from "react";
import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/common/hoc/Iteration";
import { VisibilitySwitch } from "@components/common/hoc/VisibilitySwitch";

import { UserCursor } from "@components/common/ordinary/UserCursor";

import { Image } from "@components/common/ui/Image";

import { useTransformDifference } from "@core/hooks";
import { inlineSwitch, step, toRange } from "@core/utils";

import * as S from "./styled";

export interface Props {
	templateSource: string;
	cursorAvatarSource: string;
	endContainerRef?: React.RefObject<any>;
}

export const MovedCursorTemplate: React.FC<Props> = memo(
	({ templateSource, cursorAvatarSource, endContainerRef }) => {
		const transformBtwEndAndMinContainers = useTransformDifference({
			logging: true,
			resizeType: "rect",
			endRef: endContainerRef,
		});

		return (
			<Iteration
				iteration={[7, 8]}
				visibleCondition={(iteration7, iteration8) =>
					iteration7.started() && !iteration8.startClosed()
				}>
				{(iteration7, iteration8) => (
					<div>
						<VisibilitySwitch visible={false}>
							<S.EndContainer ref={transformBtwEndAndMinContainers.startRef} />
						</VisibilitySwitch>
						<S.EndContainer style={{ perspective: `${PERSPECTIVE}rem` }}>
							<Observer>
								{() => (
									<S.Card
										className='safari-border-radius-overflow-bugfix'
										style={{
											opacity: inlineSwitch(
												iteration8.started(),
												iteration8.interpolations
													.toEasing("easeInOutCubic")
													.opening.to((value) => step(value, 1))
													.to((value) => 1 - value),
												iteration7.interpolations
													.toEasing("easeInOutCubic")
													.opening.to((value) => toRange(value, 0, 0.5))
											),
											z: iteration7.interpolations
												.toEasing("easeInOutCubic")
												.opening.to((value) => `${PERSPECTIVE * 0.5 * (1 - value)}rem`),
											x: iteration8.interpolations
												.toEasing("easeInOutCubic")
												.opening.to((value) => transformBtwEndAndMinContainers.getPosition().x * value),
											y: iteration8.interpolations
												.toEasing("easeInOutCubic")
												.opening.to((value) => transformBtwEndAndMinContainers.getPosition().y * value),
											transformOrigin: "left top",
											width: iteration8.interpolations
												.toEasing("easeInOutCubic")
												.opening.to((value) => 1 - (1 - transformBtwEndAndMinContainers.getScale().x) * value)
												.to((value) => `${(value * 100).toFixed(2)}%`),
											height: iteration8.interpolations
												.toEasing("easeInOutCubic")
												.opening.to((value) => 1 - (1 - transformBtwEndAndMinContainers.getScale().y) * value)
												.to((value) => `${(value * 100).toFixed(2)}%`),
											background: `url(${templateSource}) center center / cover`,
										}}>
										<S.CardImageGroup
											$zoom={IMAGE_ZOOM}
											style={{
												opacity: iteration7.interpolations
													.toEasing("easeInOutCubic")
													.opening.to((value) => 1 - step(value, 0.999)),
												scale: iteration7.interpolations
													.toEasing("easeInOutCubic")
													.opening.to((value) => 1 + (1 / IMAGE_ZOOM - 1) * value),
											}}>
											<Image src={templateSource} lazy={false} />
										</S.CardImageGroup>
									</S.Card>
								)}
							</Observer>
						</S.EndContainer>
						<Observer>
							{() => (
								<S.CursorGroup
									style={{
										x: iteration7.interpolations.closing
											.to({ range: [0, 1], output: [0.85, 0.45] })
											.to((value) => `${value * 100}%`),
										y: iteration7.interpolations.closing
											.to({ range: [0, 1], output: [0.75, 0.1] })
											.to((value) => `${value * 100}%`),
										opacity: inlineSwitch(
											iteration7.visible(),
											iteration7.interpolations
												.toEasing("easeInOutCubic")
												.closing.to((value) => toRange(value, 0, 0.1)),
											iteration8.interpolations
												.toEasing("easeInOutCubic")
												.opening.to((value) => toRange(value, 0, 0.1))
												.to((value) => 1 - value)
										),
									}}>
									<UserCursor avatarSource={cursorAvatarSource} />
								</S.CursorGroup>
							)}
						</Observer>
					</div>
				)}
			</Iteration>
		);
	}
);

const PERSPECTIVE = 1;
const IMAGE_ZOOM = 2;
