import { memo } from "react";
import { a, Interpolation } from "react-spring";

import { clamp } from "@core/utils";

import { getVideoByName } from "@assets/videos";

import * as S from "./styled";

export interface Props {
	openingInterpolation: Interpolation<number, number>;
	pulseInterpolation: Interpolation<number, number>;
}

export const AssistantFace: React.FC<Props> = memo(
	({ openingInterpolation, pulseInterpolation }) => {
		return (
			<S.AssistantFace>
				<S.Background>
					<S.Pulse style={{ scale: pulseInterpolation }} />
					<S.Circle>
						<svg viewBox={`0 0 ${CIRCLE_VIEW_BOX_SIZE} ${CIRCLE_VIEW_BOX_SIZE}`}>
							<a.circle
								cx={CIRCLE_CENTER}
								cy={CIRCLE_CENTER}
								r={CIRCLE_RADIUS}
								strokeDasharray={CIRCLE_CIRCUMFERENCE}
								strokeDashoffset={openingInterpolation.to((value) =>
									getCircleStrokeDashoffset(value * 100)
								)}
							/>
						</svg>
					</S.Circle>
				</S.Background>
				<S.Content>
					<S.VideoWrapper
						className='safari-border-radius-overflow-bugfix'
						style={{ scale: openingInterpolation }}>
						<a.video
							src={getVideoByName("BasicGirlSource")}
							muted
							loop
							autoPlay
							playsInline
							style={{ scale: openingInterpolation.to((value) => 1 / value) }}
						/>
					</S.VideoWrapper>
				</S.Content>
			</S.AssistantFace>
		);
	},
	({ pulseInterpolation: a }, { pulseInterpolation: b }) => a === b
);

const CIRCLE_RADIUS = 45.5;
const CIRCLE_VIEW_BOX_SIZE = 100;
const CIRCLE_CIRCUMFERENCE = Math.PI * (CIRCLE_RADIUS * 2);
const CIRCLE_CENTER = CIRCLE_VIEW_BOX_SIZE / 2;

function getCircleStrokeDashoffset(progress: number) {
	return ((100 - clamp(progress, 0, 100)) / 100) * CIRCLE_CIRCUMFERENCE;
}
