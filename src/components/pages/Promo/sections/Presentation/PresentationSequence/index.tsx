import { useEffect, memo } from "react";
import { reaction } from "mobx";

import { useIteration } from "@core/hooks/useIteration";
import { useCanvasSequence } from "@core/hooks/useCanvasSequence";
import { Sequence } from "@core/classes/Sequence";

import * as S from "./styled";

export interface Props {
	sequence: Sequence;
}

export const PresentationSequence: React.FC<Props> = memo(({ sequence }) => {
	const iteration5 = useIteration(5);
	const iteration7 = useIteration(7);
	const canvasSequence = useCanvasSequence(sequence, { resizeObserverDebounce: 100 });

	useEffect(
		() =>
			reaction(
				() => iteration7.ranges.closing(),
				(value) => {
					const currentFrame = Math.floor((sequence.amount - 1) * value);
					canvasSequence.setCurrentFrame(currentFrame);
					canvasSequence.drawCurrentFrame();
				}
			),
		[canvasSequence, iteration7, sequence.amount]
	);

	useEffect(
		() =>
			reaction(
				() => iteration5.started(),
				(started) => {
					if (!started) return;
					sequence.preloadAll().then(() => canvasSequence.drawCurrentFrame(true));
				}
			),
		[canvasSequence, iteration5, sequence]
	);

	return <S.Canvas ref={canvasSequence.ref} />;
});
