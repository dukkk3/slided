import { memo, useMemo } from "react";

import { interpolators } from "@shared/helpers";
import type { Range } from "@shared/types";
import { math } from "@shared/utils";

import * as model from "./slide-dots.model";
import * as S from "./slide-dots.styled";
import { useUnit } from "effector-react";

export const SlideDots = memo((props: React.ComponentProps<"div">) => {
	return (
		<S.SlideDots {...props}>
			{model.ITERATIONS_CHAIN_WITH_PAYLOAD.map((iteration, index) => (
				<SlideDot key={iteration.range.join("-")} index={index} range={iteration.range} />
			))}
		</S.SlideDots>
	);
});

interface SlideDotProps {
	range: Range;
	index: number;
}

const SlideDot = memo(({ range, index }: SlideDotProps) => {
	const focused = useUnit(model.ITERATIONS_CHAIN_WITH_PAYLOAD[index].$focused);
	const status = useUnit(model.ITERATIONS_CHAIN_WITH_PAYLOAD[index].$status);

	return (
		<S.SlideDot
			onClick={() => model.toIterationRunned({ index })}
			$focused={focused}
			$status={status}>
			<S.SlideDotStrokeWrapper viewBox={`0 0 ${CIRCLE_VIEW_BOX_SIZE} ${CIRCLE_VIEW_BOX_SIZE}`}>
				<S.SlideDotStroke
					cx={CIRCLE_CENTER}
					cy={CIRCLE_CENTER}
					r={CIRCLE_RADIUS}
					strokeDasharray={CIRCLE_CIRCUMFERENCE}
					strokeDashoffset={model.progress
						.to(interpolators.toRanged(...range))
						.to(interpolators.toScaledOn(100))
						.to(getCircleStrokeDashoffset)}
				/>
			</S.SlideDotStrokeWrapper>
		</S.SlideDot>
	);
});

const CIRCLE_RADIUS = 10;
const CIRCLE_VIEW_BOX_SIZE = 22;
const CIRCLE_CIRCUMFERENCE = Math.PI * (CIRCLE_RADIUS * 2);
const CIRCLE_CENTER = CIRCLE_VIEW_BOX_SIZE / 2;

const getCircleStrokeDashoffset = (progress: number) => {
	return ((100 - math.clamp(progress, 0, 100)) / 100) * CIRCLE_CIRCUMFERENCE;
};
