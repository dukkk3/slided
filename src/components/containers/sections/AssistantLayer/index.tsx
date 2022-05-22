import { a } from "react-spring";

import { SplitIntoChars } from "@components/common/simple/SplitIntoChars";

import { useScroll } from "@core/hooks";
import { clamp } from "@core/utils";

import { getVideoByName } from "@assets/videos";

import * as S from "./styled";

const CIRCLE_RADIUS = 45.5;
const CIRCLE_VIEW_BOX_SIZE = 100;
const CIRCLE_CIRCUMFERENCE = Math.PI * (CIRCLE_RADIUS * 2);
const CIRCLE_CENTER = CIRCLE_VIEW_BOX_SIZE / 2;

export const AssistantLayer: React.FC = () => {
	const scroll = useScroll();

	return (
		<S.AssistantLayer>
			<S.AssistantFace>
				<S.AssistantFaceBackground>
					<S.AssistantFacePulse
						style={{
							opacity: scroll.animated._progress.to(() =>
								scroll.animated.range(0, 0.2 / scroll.store.pages)
							),
							scale: scroll.animated._progress.to(() =>
								scroll.animated.range(0, 0.2 / scroll.store.pages)
							),
						}}
					/>
					<S.AssistantFaceCircle>
						<svg viewBox={`0 0 ${CIRCLE_VIEW_BOX_SIZE} ${CIRCLE_VIEW_BOX_SIZE}`}>
							<a.circle
								cx={CIRCLE_CENTER}
								cy={CIRCLE_CENTER}
								r={CIRCLE_RADIUS}
								strokeDasharray={CIRCLE_CIRCUMFERENCE}
								strokeDashoffset={scroll.animated._progress
									.to(() => scroll.animated.range(0.2 / scroll.store.pages, 0.21 / scroll.store.pages) * 100)
									.to((value) => getCircleStrokeDashoffset(value))}
							/>
						</svg>
					</S.AssistantFaceCircle>
				</S.AssistantFaceBackground>
				<S.AssistantFaceContentLayer>
					<S.AssistantFaceVideoWrapper
						style={{
							opacity: scroll.animated._progress.to(() =>
								scroll.animated.range(0, 0.2 / scroll.store.pages)
							),
							scale: scroll.animated._progress.to(() =>
								scroll.animated.range(0, 0.2 / scroll.store.pages)
							),
						}}>
						<a.video
							src={getVideoByName("BasicGirlSource")}
							muted
							loop
							autoPlay
							playsInline
							style={{
								scale: scroll.animated._progress.to(
									() => 1 / scroll.animated.range(0, 0.2 / scroll.store.pages)
								),
							}}
						/>
					</S.AssistantFaceVideoWrapper>
				</S.AssistantFaceContentLayer>
			</S.AssistantFace>
			<S.DescriptionWrapper>
				<SplitIntoChars text={["Let’s see how it works.", "Upload your content."]}>
					{({ char, absoluteIndex, count }) => {
						console.log(
							scroll.store.pixelAsProgress,
							absoluteIndex
							// (0.2 + scroll.store.pixelAsProgress * 5 * ) / scroll.store.pages
						);
						return (
							<a.span
								style={{
									opacity: scroll.animated._progress.to(() =>
										scroll.animated.range(
											((0.15 + 0.01 * (absoluteIndex - 1 / count)) * 0.5) / scroll.store.pages,
											((0.15 + 0.01 * ((absoluteIndex + 1) / count)) * 0.5) / scroll.store.pages
										)
									),
								}}>
								{char}
							</a.span>
						);
					}}
				</SplitIntoChars>
			</S.DescriptionWrapper>
		</S.AssistantLayer>
	);
};

function getCircleStrokeDashoffset(progress: number) {
	return ((100 - clamp(progress, 0, 100)) / 100) * CIRCLE_CIRCUMFERENCE;
}
