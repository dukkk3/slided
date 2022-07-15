import { useEffect, memo } from "react";
import { reaction } from "mobx";

import { useIteration } from "@core/hooks/useIteration";
import { useCanvasSequence } from "@core/hooks/useCanvasSequence";
import { Sequence } from "@core/classes/Sequence";

import { usePromo } from "../../../index";

import * as S from "./styled";

export interface Props {
	sequence: Sequence;
}

export const PresentationSequence: React.FC<Props> = memo(({ sequence }) => {
	const promo = usePromo();
	const iteration5 = useIteration(5);
	const iteration7 = useIteration(7);
	const canvasSequence = useCanvasSequence(sequence, { resizeObserverDebounce: 100 });

	useEffect(
		() =>
			reaction(
				() => iteration7.ranges.closing(),
				(value) => {
					if (!sequence.loaded()) return;
					const currentFrame = Math.floor((sequence.amount - 1) * value);
					canvasSequence.setCurrentFrame(currentFrame);
					canvasSequence.drawCurrentFrame();
				}
			),
		[canvasSequence, iteration7, sequence]
	);

	useEffect(() => {
		sequence.preloadAll().then(() => {
			promo.store.setPresentationCanPlay(true);
			canvasSequence.setCurrentFrame(0);
			canvasSequence.drawCurrentFrame();
		});
	}, [canvasSequence, iteration5, promo, sequence]);

	return <S.Canvas ref={canvasSequence.ref} />;
});
