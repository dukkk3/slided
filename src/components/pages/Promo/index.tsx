import { IterationsControls } from "@components/common/hoc/IterationsControls/index2";

import { useHotkey } from "@core/hooks/useHotkey";
import { useIterationsContext } from "@core/hooks/useIterationsContext";
import { createArray } from "@core/utils/common.utils";

import { DebugIterationControls } from "./DebugIterationControls";

export const Promo: React.FC = () => {
	return (
		<IterationsControls
			defaultDuration={1200}
			parts={[
				{ from: 0, to: 1 },
				{ from: 1, to: 2, duration: 2000 },
				[
					{ from: 2, to: 3, duration: 5000 },
					{ from: 3, to: 4, duration: 100 },
					{ from: 4, to: 5 },
				],
			]}>
			<Controls />
			<DebugIterationControls />
		</IterationsControls>
	);
};

const Controls: React.FC = () => {
	const iterationsContext = useIterationsContext();

	useHotkey("ArrowUp", iterationsContext.prev);
	useHotkey("ArrowDown", iterationsContext.next);

	return (
		<div>
			{createArray(iterationsContext.partsAmount).map((_, index) => (
				<button
					key={index}
					style={{ padding: "1rem", background: "blue", color: "white" }}
					onClick={() => iterationsContext.change(index)}>
					{index + 1}
				</button>
			))}
		</div>
	);
};
