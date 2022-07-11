import { useEffect, useMemo } from "react";
import { useSpring } from "react-spring";
import { reaction } from "mobx";

import { useIterationsControls } from "@core/hooks/useIterationsControls";
import { useHotkey } from "@core/hooks/useHotkey";
import { createArray } from "@core/utils/common.utils";

import * as S from "./styled";
import { Observer } from "mobx-react-lite";

export const Controls: React.FC = () => {
	const iterationsControls = useIterationsControls();
	const dotsAmount = useMemo(() => iterationsControls.partsAmount + 1, [iterationsControls]);
	const [flyingDotStyle, flyingDotApi] = useSpring(() => ({ top: "0%" }));

	useHotkey("ArrowUp", iterationsControls.prev);
	useHotkey("ArrowDown", iterationsControls.next);

	useEffect(
		() =>
			reaction(
				() => iterationsControls.getActivePartIndex(),
				(index) => flyingDotApi.start({ top: `${(index / dotsAmount) * 100}%` })
			),
		[dotsAmount, flyingDotApi, iterationsControls]
	);

	return (
		<S.Dots>
			<Observer>
				{() => (
					<S.DotGroup>
						{createArray(dotsAmount).map((_, index) => (
							<S.Dot
								key={index}
								$active={iterationsControls.getActivePartIndex() === index}
								onClick={() => iterationsControls.change(index)}
							/>
						))}
						<S.FlyingDot style={flyingDotStyle} />
					</S.DotGroup>
				)}
			</Observer>
		</S.Dots>
	);
};
