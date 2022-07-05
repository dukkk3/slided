import React, { memo } from "react";
import { Observer } from "mobx-react-lite";
import { a } from "react-spring";

import { useGlobalStore } from "@core/hooks/useGlobalStore";
import { useIterationsControls } from "@core/hooks/useIterationsControls";

import * as S from "./styled";

export const DebugIterationControls: React.FC = memo(() => {
	const iterationsControls = useIterationsControls();
	const promoStore = useGlobalStore((store) => store.layout.promo);

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
			<p>
				<span>
					Sequence Loaded: <Observer>{() => <span>{String(promoStore.sequenceLoaded)}</span>}</Observer>
				</span>
			</p>
			<p>
				<span>
					Loader Hidden: <Observer>{() => <span>{String(promoStore.loaderHidden)}</span>}</Observer>
				</span>
			</p>
			<p>
				<span>
					Can Show Content: <Observer>{() => <span>{String(promoStore.canShowContent)}</span>}</Observer>
				</span>
			</p>
			<p>
				<span>
					Sequence Progress:{" "}
					<Observer>{() => <span>{String(promoStore.sequenceProgress.toFixed(2))}</span>}</Observer>
				</span>
			</p>
			<p>
				<span>
					Sequence Frame: <Observer>{() => <span>{String(promoStore.sequenceFrame)}</span>}</Observer>
				</span>
			</p>
			<p>
				<span>
					Background Type: <Observer>{() => <span>{String(promoStore.backgroundType)}</span>}</Observer>
				</span>
			</p>
			<p>
				<span>
					Interactive Enabled:{" "}
					<Observer>{() => <span>{String(promoStore.interactiveEnabled)}</span>}</Observer>
				</span>
			</p>
		</S.DebugIterationControls>
	);
});
