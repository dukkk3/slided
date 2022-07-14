import { useEffect, memo, useRef, useCallback } from "react";
import { reaction } from "mobx";

import { useIteration } from "@core/hooks/useIteration";

import * as S from "./styled";

export interface Props {
	source: string;
}

export const PresentationVideo: React.FC<Props> = memo(({ source }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const iteration7 = useIteration(7);

	const handleRef = useCallback((element: HTMLVideoElement | null) => {
		// @ts-ignore
		videoRef.current = element;
		if (element) {
			element.play();
			element.pause();
		}
	}, []);

	useEffect(
		() =>
			reaction(
				() => iteration7.ranges.closing(),
				(value) => {
					const video = videoRef.current;
					if (!video) return;
					const duration = video.duration;
					video.currentTime = duration * value;
				}
			),
		[iteration7]
	);

	return <S.Video ref={handleRef} src={source} autoPlay muted playsInline />;
});
