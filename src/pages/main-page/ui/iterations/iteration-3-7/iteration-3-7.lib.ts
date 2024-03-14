import { type iterationUtils, interpolations } from "@shared/helpers";
import { common } from "@shared/utils";

export const calculateTemplateCardProps = (index: number, cardsAmount: number) => {
	const center = Math.ceil(cardsAmount / 2) - 1;
	const offset = Math.abs(index - center);
	const sign = Math.sign(index - center);
	const offsetAroundCenter = offset / center;
	return { center, offset, sign, offsetAroundCenter, index };
};

export const getTemplateCardStyle = ({
	cardProps: { center, offset, offsetAroundCenter, sign },
	iteration,
	isSwapped,
}: {
	iteration: iterationUtils.SpringUtilsOfFlowIteration;
	cardProps: ReturnType<typeof calculateTemplateCardProps>;
	isSwapped: boolean;
}) => {
	return {
		z: -5 * offsetAroundCenter - 0.01,
		zIndex: center - offset,
		rotateY: iteration.closing.progress
			.to(interpolations.toEased("easeInOutCubic"))
			.to(interpolations.toInverted)
			.to(interpolations.toScaled(-0.25 * offsetAroundCenter * sign)),
		opacity: iteration.opening.progress.to(interpolations.toEased("easeInOutCubic")),
		translateX: common.variant({
			if: !isSwapped,
			then: iteration.opening.progress
				.to(interpolations.toEased("easeInOutCubic"))
				.to(interpolations.toInverted)
				.to(interpolations.toScaled(200 * offsetAroundCenter * sign + 120 * offsetAroundCenter * sign))
				.to(interpolations.toPercents),
			else: iteration.closing.progress
				.to(interpolations.toEased("easeInOutCubic"))
				.to(interpolations.toInverted)
				.to(interpolations.toScaled(200 * offsetAroundCenter * sign))
				.to(interpolations.toPercents),
		}),
		scale: iteration.opening.progress.to(interpolations.toEased("easeInOutCubic")),
	};
};
