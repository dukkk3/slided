import animate from "animate";
import { createEffect, createEvent, createStore, sample } from "effector";

export const createTicker = (fps: number) => {
	const clock = createEvent();
	const start = createEvent();
	const stop = createEvent();

	const $ticks = createStore(0);

	const animation = animate(() => clock(), fps);

	animation.pause();

	sample({
		clock: start,
		target: createEffect(() => animation.resume()),
	});

	sample({
		clock: stop,
		target: createEffect(() => animation.pause()),
	});

	sample({
		clock: clock,
		source: $ticks,
		fn: (ticks) => ticks + 1,
		target: $ticks,
	});

	return {
		$ticks,
		clock,
		start,
		stop,
	};
};
