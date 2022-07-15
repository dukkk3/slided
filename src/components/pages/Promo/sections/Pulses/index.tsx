import { useCallback, useEffect } from "react";
import { a, easings, useSprings } from "react-spring";
import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/pages/Promo/helpers/Iteration";

import { useIteration } from "@core/hooks/useIteration";
import { interpolations } from "@core/helpers/iteration.helper";
import { sleep } from "@core/utils/common.utils";

import * as S from "./styled";

export const Pulses: React.FC = () => {
	return (
		<S.Pulses>
			<Iteration iterations={6} checkForVisible={([iteration6]) => iteration6.visible("closing")}>
				{([iteration6]) => (
					<S.PulseCircle
						style={{
							scale: iteration6.interpolations.closing,
							opacity: iteration6.interpolations.closing.to((value) => 0.8 * (1 - value)),
						}}
					/>
				)}
			</Iteration>
			<Iteration iterations={5}>{([iteration5]) => <Locator iteration={iteration5} />}</Iteration>
		</S.Pulses>
	);
};

interface LocatorProps {
	iteration: ReturnType<typeof useIteration>;
}

const Locator: React.FC<LocatorProps> = ({ iteration }) => {
	const [locatorPulse] = useSprings(3, () => ({
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
	}, [animate]);

	return (
		<div>
			<Observer>
				{() => (
					<a.div
						style={{
							opacity: iteration.visible("opening")
								? iteration.interpolations.opening.to(
										interpolations.defaultDuration(iteration.durationFactorOpening)
								  )
								: iteration.interpolations.closing
										.to(interpolations.defaultDuration(iteration.durationFactorClosing, "out"))
										.to(interpolations.invert),
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
		</div>
	);
};
