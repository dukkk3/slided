import { useCallback, useEffect, useRef, memo } from "react";
import { reaction } from "mobx";

import { useLocalStore, useGlobalStore, useIterationControls } from "@core/hooks";
import { clamp } from "@core/utils";

import { getVideoByName } from "@assets/videos";

import * as S from "./styled";

const iterations = [3.9, 8, 12, 17];

export const TableBackground: React.FC = memo(() => {
	const videoRef = useRef<HTMLVideoElement>(null!);
	const localStore = useLocalStore({ currentTime: 0 });
	const promoStore = useGlobalStore((store) => store.layout.promo);
	const iterationControls = useIterationControls();

	const handleVideoTimeUpdate = useCallback(() => {
		const video = videoRef.current;
		localStore.setCurrentTime(video.currentTime);
	}, [localStore]);

	const drawIterationSequence = useCallback(
		(iteration: number) => {
			if (!iterationControls.store.inRange(iteration - 1, iteration)) return;

			const video = videoRef.current;
			const [startIteration, endIteration] = [iterations[iteration - 1], iterations[iteration]];
			const progress = iterationControls.store.toRange(
				iteration - 1,
				iteration === 3 ? 2.5 : iteration
			);

			const diff = Math.abs(startIteration - endIteration);
			const frameIndex = startIteration + diff * progress;

			video.currentTime = clamp(frameIndex, 0, video.duration - 0.01);
		},
		[iterationControls]
	);

	useEffect(
		() =>
			reaction(
				() => iterationControls.store.toRange(0, iterations.length - 1),
				(progress) => {
					if (!promoStore.interactiveEnabled()) return;

					drawIterationSequence(1);
					drawIterationSequence(2);
					drawIterationSequence(3);
				}
			),
		[drawIterationSequence, iterationControls, localStore, promoStore]
	);

	useEffect(
		() =>
			reaction(
				() => localStore.currentTime >= 3.5 && !promoStore.sequenceOpeningAnimationEnded,
				(opened) => {
					if (!opened) return;
					const video = videoRef.current;
					promoStore.setSequenceOpeningAnimationEnded(true);
					video.pause();
				}
			),
		[localStore, promoStore]
	);

	return (
		<S.TableBackground>
			<S.Video
				ref={videoRef}
				src={getVideoByName("TableSource")}
				playsInline
				muted
				autoPlay
				onTimeUpdate={handleVideoTimeUpdate}
			/>
		</S.TableBackground>
	);
});
