import { useCallback, useEffect, useRef, memo } from "react";
import { reaction } from "mobx";

import { useGlobalStore, useIterationsControls, useQueryParam } from "@core/hooks";
import { clamp } from "@core/utils";

import { getVideoByName } from "@assets/videos";

import * as S from "./styled";

const iterations = [3.9, 8, 12, 17];

export const TableBackground: React.FC = memo(() => {
	const videoRef = useRef<HTMLVideoElement>(null!);
	const promoStore = useGlobalStore((store) => store.layout.promo);
	const iterationsControls = useIterationsControls();
	const minified = useQueryParam("minified");

	const handleVideoTimeUpdate = useCallback(() => {
		const video = videoRef.current;
		promoStore.setSequenceProgress(video.currentTime / video.duration);
	}, [promoStore]);

	const drawIterationSequence = useCallback(
		(iteration: number) => {
			if (!iterationsControls.store.inRange(iteration - 1, iteration)) return;

			const video = videoRef.current;
			const [startIteration, endIteration] = [iterations[iteration - 1], iterations[iteration]];
			const progress = iterationsControls.store.toRange(
				iteration - 1,
				iteration === 3 ? 2.5 : iteration
			);

			const diff = Math.abs(startIteration - endIteration);
			const frameIndex = startIteration + diff * progress;

			video.currentTime = clamp(frameIndex, 0, video.duration - 0.5);
		},
		[iterationsControls]
	);

	const handleVideoLoad = useCallback(() => {
		// const video = videoRef.current!;
		promoStore.setSequenceLoaded(true);

		// if (!promoStore.sequenceOpeningAnimationEnded) {
		// 	// video.play();
		// 	// video.pause();
		// }
	}, [promoStore]);

	const handleDocumentKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const video = videoRef.current;

			if (promoStore.sequenceOpeningAnimationEnded || !video) return;

			switch (event.key) {
				case "ArrowLeft":
					video.play();
			}
		},
		[promoStore]
	);

	useEffect(() => {
		document.addEventListener("keydown", handleDocumentKeyDown);

		return () => {
			document.removeEventListener("keydown", handleDocumentKeyDown);
		};
	}, [handleDocumentKeyDown]);

	useEffect(
		() =>
			reaction(
				() => iterationsControls.store.toRange(0, iterations.length - 1),
				(progress) => {
					if (!promoStore.interactiveEnabled) return;

					drawIterationSequence(1);
					drawIterationSequence(2);
					drawIterationSequence(3);
				}
			),
		[drawIterationSequence, iterationsControls, promoStore]
	);

	useEffect(
		() =>
			reaction(
				() => promoStore.canShowContent,
				(canShowContent) => {
					if (canShowContent) {
						const video = videoRef.current!;
						video.play();
					}
				}
			),
		[promoStore]
	);

	useEffect(
		() =>
			reaction(
				() =>
					promoStore.sequenceProgress * videoRef.current.duration >= 3.5 &&
					!promoStore.sequenceOpeningAnimationEnded,
				(opened) => {
					if (!opened) return;
					const video = videoRef.current;
					promoStore.setSequenceOpeningAnimationEnded(true);
					video.pause();
				}
			),
		[promoStore]
	);

	return (
		<S.TableBackground>
			<S.Video
				ref={videoRef}
				src={getVideoByName(minified ? "TableMin" : "Table")}
				playsInline
				muted
				onTimeUpdate={handleVideoTimeUpdate}
				onCanPlayThrough={handleVideoLoad}
			/>
		</S.TableBackground>
	);
});
