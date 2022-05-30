import React, { memo } from "react";
import { a } from "react-spring";

import { useIterationControls } from "@core/hooks";

import * as S from "./styled";

export const DebugIterationControls: React.FC = memo(() => {
	const iterationControls = useIterationControls();

	return (
		<S.DebugIterationControls>
			<p>
				<span>Debug</span>
			</p>
			<p>
				<span>
					Progress:{" "}
					<a.span>
						{iterationControls.animated.progress.to((value) => value.toFixed(4)) as unknown as number}
					</a.span>
				</span>
			</p>
			<p>
				<span>
					Iteration:{" "}
					<a.span>
						{
							iterationControls.animated.progress.to((value) =>
								(value * iterationControls.iterations).toFixed(4)
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
							iterationControls.animated.progress.to((value) =>
								Math.floor(value * iterationControls.iterations)
							) as unknown as number
						}
					</a.span>
				</span>
			</p>
		</S.DebugIterationControls>
	);
});
