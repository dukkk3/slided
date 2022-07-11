import React, { memo } from "react";
import { a } from "react-spring";

// import { useGlobalStore } from "@core/hooks/useGlobalStore";
import { useIterationsControls } from "@core/hooks/useIterationsControls";

import * as S from "./styled";

export const DebugIterationControls: React.FC = memo(() => {
	const iterationsControls = useIterationsControls();

	return (
		<S.DebugIterationControls>
			<p>
				<span>Debug</span>
			</p>
			<p>
				<span>
					Progress:{" "}
					<a.span>
						{iterationsControls.animated.progress.to((value) => value.toFixed(4)) as unknown as number}
					</a.span>
				</span>
			</p>
			<p>
				<span>
					Iteration:{" "}
					<a.span>
						{
							iterationsControls.animated.progress.to((value) =>
								(value * iterationsControls.iterations).toFixed(4)
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
							iterationsControls.animated.progress.to((value) =>
								Math.floor(value * iterationsControls.iterations)
							) as unknown as number
						}
					</a.span>
				</span>
			</p>
		</S.DebugIterationControls>
	);
});
