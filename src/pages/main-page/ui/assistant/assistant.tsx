import { useGate, useUnit } from "effector-react";

import { springUtils } from "@shared/helpers";
import { VisibilityToggler } from "@shared/ui";
import { common, math } from "@shared/utils";

import * as model from "./assistant.model";
import * as S from "./assistant.styled";

export const Assistant = () => {
	const assistantStyle = model.assistantShapeInterpolator.useStyle();
	const isVisible = useUnit(model.$inRange1_7);

	useGate(model.Gate);

	return (
		<VisibilityToggler isHidden={!isVisible}>
			<S.Assistant style={springUtils.optimizeStyleForRendering(assistantStyle)}>
				<Face />
			</S.Assistant>
			<S.BorderWrapper style={{ opacity: 0 }}>
				<S.Border />
			</S.BorderWrapper>
		</VisibilityToggler>
	);
};

const faceOpeningInterpolation = model.iteration1.opening.progress.to(
	springUtils.toEase("easeInOutCubic")
);

const Face = () => {
	const iteration1Opened = !useUnit(model.$iteration1.opening.$ended);

	return (
		<S.Face>
			<S.Background>
				<S.Pulse
					style={springUtils.optimizeStyleForRendering({
						scale: common.variant({
							if: iteration1Opened,
							then: model.iteration1.opening.progress.to(springUtils.toEase("easeInOutCubic")),
							else: model.pulseProgress,
						}),
					})}
				/>
				<S.Circle>
					<svg viewBox={`0 0 ${CIRCLE_VIEW_BOX_SIZE} ${CIRCLE_VIEW_BOX_SIZE}`}>
						<S.AssistantCircle
							cx={CIRCLE_CENTER}
							cy={CIRCLE_CENTER}
							r={CIRCLE_RADIUS}
							strokeDasharray={CIRCLE_CIRCUMFERENCE}
							strokeDashoffset={faceOpeningInterpolation
								.to((value) => value * 100)
								.to(getCircleStrokeDashoffset)}
						/>
					</svg>
				</S.Circle>
			</S.Background>
			<S.Content>
				<S.AssistantCanvasWrapper
					className='safari-border-radius-overflow-bugfix'
					style={springUtils.optimizeStyleForRendering({ scale: faceOpeningInterpolation })}>
					<S.AssistantInvertCanvasWrapper
						style={springUtils.optimizeStyleForRendering({
							scale: faceOpeningInterpolation.to((value) => 1 / value),
						})}>
						<S.AssistantCanvas />
					</S.AssistantInvertCanvasWrapper>
				</S.AssistantCanvasWrapper>
			</S.Content>
		</S.Face>
	);
};

const CIRCLE_RADIUS = 45.5;
const CIRCLE_VIEW_BOX_SIZE = 100;
const CIRCLE_CIRCUMFERENCE = Math.PI * (CIRCLE_RADIUS * 2);
const CIRCLE_CENTER = CIRCLE_VIEW_BOX_SIZE / 2;

const getCircleStrokeDashoffset = (progress: number) => {
	return ((100 - math.clamp(progress, 0, 100)) / 100) * CIRCLE_CIRCUMFERENCE;
};
