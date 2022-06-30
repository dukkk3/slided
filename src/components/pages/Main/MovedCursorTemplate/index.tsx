import { memo, useEffect } from "react";
import { Observer } from "mobx-react-lite";
import { reaction } from "mobx";

import { Iteration } from "@components/common/hoc/Iteration";
import { VisibilitySwitch } from "@components/common/hoc/VisibilitySwitch";

import { Image } from "@components/common/ui/Image";

import {
	useBreakpoint,
	useCanvasSequence,
	useIteration,
	useTransformDifference,
} from "@core/hooks";
import { inlineSwitch, step } from "@core/utils";
import { Sequence } from "@core/classes";

import * as S from "./styled";

export interface Props {
	templateSource: string;
	cursorAvatarSource: string;
	endContainerRef?: React.RefObject<any>;
}

export const MovedCursorTemplate: React.FC<Props> = memo(
	({ templateSource, cursorAvatarSource, endContainerRef }) => {
		const iteration5 = useIteration(5);
		const iteration7 = useIteration(7);

		const breakpoint = useBreakpoint();

		const canvasSequence = useCanvasSequence(SEQUENCE, { resizeObserverDebounce: 100 });
		const transformBtwEndAndMinContainers = useTransformDifference({
			resizeType: "rect",
			endRef: endContainerRef,
		});

		useEffect(
			() =>
				reaction(
					() => [iteration7.ranges.closing(), breakpoint.range("mobile", "tablet")] as const,
					([value, mobile]) => {
						if (mobile) return;
						const currentFrame = Math.floor((SEQUENCE.amount - 1) * value);
						canvasSequence.setCurrentFrame(currentFrame);
						canvasSequence.drawCurrentFrame();
					}
				),
			[breakpoint, canvasSequence, iteration7]
		);

		useEffect(
			() =>
				reaction(
					() => [iteration5.started(), breakpoint.range("mobile", "tablet")] as const,
					async ([started, mobile]) => {
						if (!started || mobile) return;
						await SEQUENCE.preloadAll();
						canvasSequence.drawCurrentFrame(true);
					}
				),
			[breakpoint, canvasSequence, iteration5]
		);

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
												scale: iteration7.interpolations.opening
													.to(interpolations.easing("easeInOutCubic"))
													.to((value) => 1 + (1 / IMAGE_ZOOM - 1) * value),
												opacity: iteration7.interpolations.closing
													.to(interpolations.easing("easeInOutCubic"))
													.to(interpolations.step(0.999))
													.to(interpolations.invert),
											}}>
											{breakpoint.range("mobile", "laptop") ? (
												<Image src={templateSource} lazy={false} />
											) : (
												<S.Canvas ref={canvasSequence.ref} />
											)}
											<S.Canvas ref={canvasSequence.ref} />
										</S.CardImageGroup>
									</S.Card>
								)}
							</Observer>
						</S.EndContainer>
					</div>
				)}
			</Iteration>
		);
	}
);

const PERSPECTIVE = 1;
const IMAGE_ZOOM = 2;
const SEQUENCE = new Sequence(
	125,
	(index) =>
		`https://ik.imagekit.io/64nah4dsw/slided/present_sequence/${String(index + 1).padStart(
			3,
			"0"
		)}.jpg`
);
