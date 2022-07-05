import { useContext, useEffect } from "react";
import { Observer } from "mobx-react-lite";
import { reaction } from "mobx";

import { Iteration } from "@components/common/hoc/Iteration";
import { VisibilitySwitch } from "@components/common/hoc/VisibilitySwitch";

import { useIteration } from "@core/hooks/useIteration";
import { useBreakpoint } from "@core/hooks/useBreakpoint";
import { useCanvasSequence } from "@core/hooks/useCanvasSequence";
import { interpolations } from "@core/helpers/iteration.helper";
import { Sequence } from "@core/classes/Sequence";
import { getMatchMediaQuery } from "@core/helpers/device.helper";
import { step } from "@core/utils/math.utils";

import * as S from "./styled";

import { transformsContext } from "../../index";

export interface Props {
	templateSource: string;
	containerRef: React.Ref<any>;
}

export const MovedCursorTemplate: React.FC<Props> = ({ containerRef, templateSource }) => {
	const transforms = useContext(transformsContext);

	const iteration5 = useIteration(5);
	const iteration7 = useIteration(7);

	const breakpoint = useBreakpoint();

	const canvasSequence = useCanvasSequence(SEQUENCE, { resizeObserverDebounce: 100 });

	useEffect(
		() =>
			reaction(
				() => [iteration7.ranges.closing(), breakpoint.mobile()] as const,
				([value, mobile]) => {
					// if (mobile) return;
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
				() => [iteration5.started(), breakpoint.mobile()] as const,
				async ([started, mobile]) => {
					if (!started) return;
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
					transforms.bigTemplateAndPhoneTemplate.calculate();
				}
			),
		[iteration7, transforms]
	);

	return (
		<Iteration
			iterations={[7, 8]}
			checkForVisible={([iteration7, iteration8]) => iteration7.started() && !iteration8.opened()}>
			{([iteration7, iteration8]) => (
				<div>
					<VisibilitySwitch visible={false}>
						<S.EndContainer ref={containerRef} />
					</VisibilitySwitch>
					<S.EndContainer style={{ perspective: `${PERSPECTIVE}rem` }}>
						<Observer>
							{() => (
								<S.Card
									className='safari-border-radius-overflow-bugfix'
									style={{
										opacity: iteration8.started()
											? iteration8.interpolations.opening
													.to(interpolations.easing("easeInOutCubic"))
													.to((value) => step(value, 1))
													.to(interpolations.invert)
											: iteration7.interpolations.opening
													.to(interpolations.easing("easeInOutCubic"))
													.to(interpolations.range(0, 0.5)),
										z: iteration7.interpolations.opening
											.to(interpolations.easing("easeInOutCubic"))
											.to(interpolations.invert)
											.to((value) => `${PERSPECTIVE * 0.4 * value}rem`),
										x: iteration8.interpolations.opening
											.to(interpolations.easing("easeInOutCubic"))
											.to((value) => transforms.bigTemplateAndPhoneTemplate.getPosition().x * value),
										y: iteration8.interpolations.opening
											.to(interpolations.easing("easeInOutCubic"))
											.to((value) => transforms.bigTemplateAndPhoneTemplate.getPosition().y * value),
										width: iteration8.interpolations.opening
											.to(interpolations.easing("easeInOutCubic"))
											.to((value) => 1 - (1 - transforms.bigTemplateAndPhoneTemplate.getScale().x) * value)
											.to((value) => `${value * 100}%`),
										height: iteration8.interpolations.opening
											.to(interpolations.easing("easeInOutCubic"))
											.to((value) => 1 - (1 - transforms.bigTemplateAndPhoneTemplate.getScale().y) * value)
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
												.to(breakpoint.mobile() ? interpolations.range(0.99, 1) : interpolations.step(0.999))
												.to(interpolations.invert),
										}}>
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
};

const phoneMediaQuery = window.matchMedia(getMatchMediaQuery("tablet", "max"));

const PERSPECTIVE = 1;
const IMAGE_ZOOM = 2;
const SEQUENCE = new Sequence(
	125,
	(index) =>
		`https://ik.imagekit.io/64nah4dsw/slided/present_sequence${
			phoneMediaQuery.matches ? "_mobile" : ""
		}/${String(index + 1).padStart(3, "0")}.jpg`
);
