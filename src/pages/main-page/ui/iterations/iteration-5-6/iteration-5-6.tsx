import { animated } from "@react-spring/web";
import { useUnit } from "effector-react";

import { interpolators } from "@shared/helpers";
import { VisibilityToggler } from "@shared/ui";
import { common } from "@shared/utils";

import { IterationContainer } from "../../iteration-container";

import * as model from "./iteration-5-6.model";
import * as S from "./iteration-5-6.styled";

export const Iteration5_6 = () => {
	const isSectionVisible = useUnit(model.$inRange5_6);

	return (
		<VisibilityToggler isHidden={!isSectionVisible}>
			<IterationContainer>
				<S.Pulses>
					<Pulse />
					<Locator />
				</S.Pulses>
			</IterationContainer>
		</VisibilityToggler>
	);
};

const Pulse = () => {
	const isVisible = useUnit(model.$iteration6.closing.$inFlight);

	return (
		<VisibilityToggler isHidden={!isVisible}>
			<S.Circle
				$variant='green'
				style={{
					scale: model.iteration6.closing.progress,
					opacity: model.iteration6.closing.progress
						.to(interpolators.toInverted)
						.to(interpolators.toScaledOn(0.8)),
				}}
			/>
		</VisibilityToggler>
	);
};

const Locator = () => {
	const isVisible = useUnit(model.$iteration5Status);
	const iteration5OpeningStatus = useUnit(model.$iteration5.opening.$inFlight);

	return (
		<VisibilityToggler isHidden={!isVisible}>
			<animated.div
				style={{
					opacity: common.variant({
						if: iteration5OpeningStatus,
						then: model.iteration5.opening.progress.to(
							interpolators.toClampedScaled(model.iteration5.opening.durationFactor)
						),
						else: model.iteration5.closing.progress
							.to(interpolators.toClampedScaled(model.iteration5.closing.durationFactor, "out"))
							.to(interpolators.toInverted),
					}),
				}}>
				{model.pulses.map((pulse, index) => (
					<S.Circle
						key={index}
						$variant='white'
						style={{
							scale: pulse,
							opacity: pulse.to(interpolators.toInverted),
						}}
					/>
				))}
			</animated.div>
		</VisibilityToggler>
	);
};
