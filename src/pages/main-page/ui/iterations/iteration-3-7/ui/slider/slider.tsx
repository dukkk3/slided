import { useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { forwardRef, useRef } from "react";
import useMeasure from "react-use-measure";

import { interpolations, springUtils } from "@shared/helpers";
import { AssignComponentProps } from "@shared/ui";
import { common, math } from "@shared/utils";

import * as assets from "./assets";
import * as S from "./slider.styled";

export interface SliderProps extends React.ComponentProps<"div"> {
	isSwipeEnabled?: boolean;
	onSwipeEnd?: () => void;
}

export const Slider = AssignComponentProps(
	forwardRef<HTMLDivElement, SliderProps>(({ isSwipeEnabled, onSwipeEnd, ...rest }, ref) => {
		const [measureRef, { width }] = useMeasure({ debounce: 100 });
		const sliderRef = useRef<HTMLDivElement>(null);
		const [buttonStyle, buttonApi] = useSpring(
			() => ({
				x: isSwipeEnabled ? 0 : 1,
			}),
			[isSwipeEnabled]
		);

		useDrag(
			({ dragging, movement: [mx], cancel, canceled }) => {
				if (!isSwipeEnabled) return;

				const realProgress = mx / width;
				let progress = realProgress;

				if (!dragging && !canceled) progress = 0;
				if (realProgress >= 0.55) progress = 1;

				if (progress === 0 || progress >= 0.99) {
					buttonApi.start({
						x: math.clamp(progress, 0, 1),
						onRest: {
							x: ({ value }) => {
								if (!value) return;
								if (!onSwipeEnd) return;
								onSwipeEnd();
							},
						},
					});
				} else {
					buttonApi.set({ x: math.clamp(progress, 0, 1) });
				}

				if (progress >= 1) {
					cancel();
				}
			},
			{ target: sliderRef, axis: "x" }
		);

		return (
			<S.Slide {...rest} ref={common.mergeRefs(ref, measureRef, sliderRef)}>
				<S.SlideContent
					style={springUtils.optimizeStyleForRendering({
						x: buttonStyle.x.to(interpolations.toScaled(100)).to(interpolations.toPercents),
					})}>
					<S.SlideButton>
						<S.SlideButtonImage src={assets.logoRay} />
					</S.SlideButton>
				</S.SlideContent>
				<S.SlideButtonLabelGroup style={{ opacity: buttonStyle.x.to(interpolations.toInverted) }}>
					<S.SlideButtonLabel>Slide to answer</S.SlideButtonLabel>
				</S.SlideButtonLabelGroup>
			</S.Slide>
		);
	}),
	{ S }
);
