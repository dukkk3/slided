import React, { memo } from "react";
import { a } from "react-spring";
import { Observer } from "mobx-react-lite";

import { useIterationsControls } from "@components/providers/IterationsControlsProvider";
import { useBreakpoint } from "@core/hooks/useBreakpoint";

import * as S from "./styled";

export const DebugIterationControls: React.FC = memo(() => {
	const breakpoint = useBreakpoint();
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
			{/* <p>
				<Observer>
					{() => (
						<span>
							Media Matches: <span>{JSON.stringify(breakpoint.getMediaMatches())}</span>
						</span>
					)}
				</Observer>
			</p> */}
			<p>
				<Observer>
					{() => (
						<span>
							Orientation: <span>{breakpoint.portrait() ? "portrait" : "landscape"}</span>
						</span>
					)}
				</Observer>
			</p>
		</S.DebugIterationControls>
	);
});
