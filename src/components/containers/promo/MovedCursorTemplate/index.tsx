import { memo, useEffect } from "react";
import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/common/hoc/Iteration";
import { VisibilitySwitch } from "@components/common/hoc/VisibilitySwitch";

import { UserCursor } from "@components/common/ordinary/UserCursor";

import { Image } from "@components/common/ui/Image";

import { useIteration, useTransformDifference } from "@core/hooks";
import { inlineSwitch, step } from "@core/utils";

import * as S from "./styled";
import { reaction } from "mobx";

export interface Props {
	templateSource: string;
	cursorAvatarSource: string;
	endContainerRef?: React.RefObject<any>;
}

export const MovedCursorTemplate: React.FC<Props> = memo(
	({ templateSource, cursorAvatarSource, endContainerRef }) => {
		const iteration7 = useIteration(7);
		const transformBtwEndAndMinContainers = useTransformDifference({
			resizeType: "rect",
			endRef: endContainerRef,
		});

		useEffect(
			() =>
				reaction(
					() => iteration7.started(),
					(started) => {
						if (!started) return;
						transformBtwEndAndMinContainers.calculate();
					}
				),
			[iteration7, transformBtwEndAndMinContainers]
		);

		return (
			<Iteration
				iterations={[7, 8]}
				checkForVisible={([iteration7, iteration8]) => iteration7.started() && !iteration8.opened()}>
				{([iteration7, iteration8], interpolations) => (
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
												iteration8.interpolations.opening
													.to(interpolations.easing("easeInOutCubic"))
													.to((value) => step(value, 1))
													.to(interpolations.invert),
												iteration7.interpolations.opening
													.to(interpolations.easing("easeInOutCubic"))
													.to(interpolations.range(0, 0.5))
											),
											z: iteration7.interpolations.opening
												.to(interpolations.easing("easeInOutCubic"))
												.to(interpolations.invert)
												.to((value) => `${PERSPECTIVE * 0.4 * value}rem`),
											x: iteration8.interpolations.opening
												.to(interpolations.easing("easeInOutCubic"))
												.to((value) => transformBtwEndAndMinContainers.getPosition().x * value),
											y: iteration8.interpolations.opening
												.to(interpolations.easing("easeInOutCubic"))
												.to((value) => transformBtwEndAndMinContainers.getPosition().y * value),
											width: iteration8.interpolations.opening
												.to(interpolations.easing("easeInOutCubic"))
												.to((value) => 1 - (1 - transformBtwEndAndMinContainers.getScale().x) * value)
												.to((value) => `${value * 100}%`),
											height: iteration8.interpolations.opening
												.to(interpolations.easing("easeInOutCubic"))
												.to((value) => 1 - (1 - transformBtwEndAndMinContainers.getScale().y) * value)
												.to((value) => `${value * 100}%`),
											background: `url(${templateSource}) center center / cover`,
											transformOrigin: "left top",
										}}>
										<S.CardImageGroup
											$zoom={IMAGE_ZOOM}
											style={{
												opacity: iteration7.interpolations.opening
													.to(interpolations.easing("easeInOutCubic"))
													.to(interpolations.step(0.999))
													.to(interpolations.invert),
												scale: iteration7.interpolations.opening
													.to(interpolations.easing("easeInOutCubic"))
													.to((value) => 1 + (1 / IMAGE_ZOOM - 1) * value),
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
											iteration7.interpolations.closing
												.to(interpolations.easing("easeInOutCubic"))
												.to(interpolations.range(0, 0.1)),
											iteration8.interpolations.opening
												.to(interpolations.easing("easeInOutCubic"))
												.to(interpolations.range(0, 0.1))
												.to(interpolations.invert)
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
