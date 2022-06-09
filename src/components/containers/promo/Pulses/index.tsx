import { memo, useCallback, useEffect } from "react";
import { a, easings, useSprings } from "react-spring";
import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/common/hoc/Iteration";

import { sleep } from "@core/utils";

import * as S from "./styled";

export const Pulses: React.FC = memo(() => {
	const [locatorPulse, locatorPulseApi] = useSprings(3, () => ({
		value: 0,
	}));

	const animate = useCallback(async () => {
		const config = {
			from: { value: 0.1 },
			to: { value: 1 },
			config: { duration: 2000, easing: easings.linear },
			loop: true,
		};

		locatorPulse[0].value.start(config);
		await sleep(1700);
		locatorPulse[1].value.start(config);
		await sleep(1700);
		locatorPulse[2].value.start(config);
	}, [locatorPulse]);

	useEffect(() => {
		animate();

		return () => {
			locatorPulseApi.stop();
		};
	}, [animate, locatorPulseApi]);

	return (
		<S.Pulses>
			<Iteration iteration={6} visibleCondition={(iteration6) => iteration6.visible("closing")}>
				{(iteration6) => (
					<S.PulseCircle
						style={{
							scale: iteration6.interpolations.closing,
							opacity: iteration6.interpolations.closing.to((value) => 0.8 * (1 - value)),
						}}
					/>
				)}
			</Iteration>
			<Iteration iteration={5} normalizeDuration>
				{(iteration5) => (
					<Observer>
						{() => (
							<a.div
								style={{
									opacity: iteration5.visible("opening")
										? iteration5.interpolations.opening
										: iteration5.interpolations.closing.to((value) => 1 - value),
								}}>
								<S.PulseCircle
									$theme='white'
									style={{
										scale: locatorPulse[0].value,
										opacity: locatorPulse[0].value.to((value) => 1 - value),
									}}
								/>
								<S.PulseCircle
									$theme='white'
									style={{
										scale: locatorPulse[1].value,
										opacity: locatorPulse[1].value.to((value) => 1 - value),
									}}
								/>
								<S.PulseCircle
									$theme='white'
									style={{
										scale: locatorPulse[2].value,
										opacity: locatorPulse[2].value.to((value) => 1 - value),
									}}
								/>
							</a.div>
						)}
					</Observer>
				)}
			</Iteration>
		</S.Pulses>
	);
});
