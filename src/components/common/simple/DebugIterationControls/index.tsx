import React, { memo } from "react";
import { a } from "react-spring";

import { useIterationsContext } from "@core/hooks";

import * as S from "./styled";

export const DebugIterationControls: React.FC = memo(() => {
	const iterationsContext = useIterationsContext();

	return (
		<S.DebugIterationControls>
			<p>
				<span>Debug</span>
			</p>
			<p>
				<span>
					Progress:{" "}
					<a.span>
						{iterationsContext.animated.progress.to((value) => value.toFixed(4)) as unknown as number}
					</a.span>
				</span>
			</p>
			<p>
				<span>
					Iteration:{" "}
					<a.span>
						{
							iterationsContext.animated.progress.to((value) =>
								(value * iterationsContext.iterations).toFixed(4)
							) as unknown as number
						}
					</a.span>
				</span>
			</p>
			<p>
				<span>
					Iteration №:{" "}
					<a.span>
						{
							iterationsContext.animated.progress.to((value) =>
								Math.floor(value * iterationsContext.iterations)
							) as unknown as number
						}
					</a.span>
				</span>
			</p>
		</S.DebugIterationControls>
	);
});
