import { createStore, createEvent, sample } from "effector";
import { SpringValue } from "@react-spring/web";
import { previous } from "patronum";

const progress = new SpringValue(0, {
	onChange: (value) => settedProgress(value as unknown as number),
});

const $progress = createStore(progress.get());
const $previousProgress = previous($progress, 0);

const settedProgress = createEvent<number>();

sample({
	clock: settedProgress,
	target: $progress,
});

export { progress, $progress, $previousProgress };
