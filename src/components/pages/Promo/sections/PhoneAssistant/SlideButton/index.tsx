import { useRef } from "react";
import { useSpring } from "react-spring";
import { useDrag } from "@use-gesture/react";

import { Image } from "@components/common/ui/Image";

import { useResizeObserver } from "@core/hooks/useResizeObserver";
import { mergeRefs } from "@core/utils/common.utils";
import { clamp } from "@core/utils/math.utils";

import { getVectorImageByName } from "@assets/images";

import * as S from "./styled";

export interface Props {
	state: "active" | "inactive";
	onSwipeEnded?: () => void;
}

export const SlideButton: React.FC<Props> = ({ state, onSwipeEnded }) => {
	const [buttonStyle, buttonApi] = useSpring(
		() => ({
			x: state === "active" ? 0 : 1,
		}),
		[state]
	);
	const buttonGroupResizeObserver = useResizeObserver({
		debounce: 100,
		calculateSizeWithPaddings: true,
	});
	const buttonRef = useRef<any>(null);

	useDrag(
		({ dragging, movement: [mx], cancel, canceled }) => {
			if (state !== "active") return;

			const realProgress = mx / buttonGroupResizeObserver.getSize().width;
			let progress = realProgress;

			if (!dragging && !canceled) progress = 0;
			if (realProgress >= 0.55) progress = 1;

			if (progress === 0 || progress >= 0.99) {
				buttonApi.start({
					x: clamp(progress, 0, 1),
					onRest: {
						x: (value) => {
							if (value.value === 1 && onSwipeEnded) onSwipeEnded();
						},
					},
				});
			} else {
				buttonApi.set({ x: clamp(progress, 0, 1) });
			}

			if (progress >= 1) {
				cancel();
			}
		},
		{ target: buttonRef, axis: "x" }
	);

	return (
		<S.Slide
			className='safari-border-radius-overflow-bugfix'
			ref={mergeRefs(buttonGroupResizeObserver.ref, buttonRef)}>
			<S.SlideContent style={{ x: buttonStyle.x.to((value) => `${value * 100}%`) }}>
				<S.SlideButton>
					<Image src={getVectorImageByName("common", "LogoRayIcoSource")} lazy={false} />
				</S.SlideButton>
			</S.SlideContent>
			<S.SlideButtonLabelGroup style={{ opacity: 1 }}>
				<S.SlideButtonLabel>Slide to answer</S.SlideButtonLabel>
			</S.SlideButtonLabelGroup>
		</S.Slide>
	);
};
