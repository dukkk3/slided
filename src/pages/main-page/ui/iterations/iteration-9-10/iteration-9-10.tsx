import { useUnit } from "effector-react";
import { memo } from "react";

import { interpolators, springUtils } from "@shared/helpers";
import { VisibilityToggler } from "@shared/ui";
import { common, math } from "@shared/utils";

import { IterationContainer } from "../../iteration-container";

import { PRESENTATIONS } from "./iteration-9-10.config";
import * as model from "./iteration-9-10.model";
import * as S from "./iteration-9-10.styled";

const CELLS_AMOUNT = PRESENTATIONS.flat(1).length;
const CENTER_COLUMN = (PRESENTATIONS[0].length - 1) / 2;
const CENTER_ROW = (PRESENTATIONS.length - 1) / 2;
const MAX_DISTANCE = getDistanceFromCenter(0, 0, CENTER_COLUMN, CENTER_ROW);

export interface Iteration9_10Props {
	hidden?: boolean;
}

export const Iteration9_10 = memo(({ hidden }: Iteration9_10Props) => {
	const isVisible = useUnit(model.$inRange9_10);

	return (
		<VisibilityToggler isHidden={!isVisible || hidden}>
			<IterationContainer>
				<S.Grid
					style={springUtils.optimizeStyleForRendering(
						common.variant({
							if: !hidden,
							then: {
								y: model.iteration10.closing.progress
									.to(interpolators.toEased("easeInOutCubic"))
									.to(interpolators.toScaledOn(-50))
									.to(interpolators.toPercents),
								opacity: model.iteration10.closing.progress
									.to(interpolators.toEased("easeInOutCubic"))
									.to(interpolators.toInverted),
							},
							else: {},
						})
					)}>
					<Grid hidden={hidden} />
					{!hidden ? <Description /> : null}
				</S.Grid>
			</IterationContainer>
		</VisibilityToggler>
	);
});

const Grid = ({ hidden }: Iteration9_10Props) => {
	const iteration10OpeningStatus = useUnit(model.$iteration10.opening.$started);
	const [presentationRef] = model.usePresentationShapeRect("in-grid");
	const presentationCardRect = model.usePresentationCardRect();

	return (
		<S.Layer>
			{PRESENTATIONS.map((row, rowIndex) => (
				<S.Row key={rowIndex}>
					{row.map((presentationSrc, columnIndex) => {
						const distance = getDistanceFromCenter(rowIndex, columnIndex, CENTER_COLUMN, CENTER_ROW);
						const origin = getOrigin(rowIndex, columnIndex, CENTER_COLUMN, CENTER_ROW);
						const invertDistance = MAX_DISTANCE - distance;
						const normalizedInvertDistance = invertDistance / MAX_DISTANCE;

						return (
							<S.PresentationGroup
								key={columnIndex}
								style={{
									zIndex: CELLS_AMOUNT - Math.round(distance),
								}}>
								<S.PresentationWrapper
									style={{
										perspective: PERSPECTIVE,
										perspectiveOrigin: origin,
										width: presentationCardRect.width,
										height: presentationCardRect.height,
									}}>
									{rowIndex === CENTER_ROW && columnIndex === CENTER_COLUMN && (
										<VisibilityToggler isHidden>
											<S.Presentation
												ref={common.variant({ if: Boolean(hidden), then: presentationRef })}
												$overlay
											/>
										</VisibilityToggler>
									)}
									<S.Presentation
										src={presentationSrc}
										className='border-radius-overflow-bugfix'
										style={springUtils.optimizeStyleForRendering(
											common.variant({
												if: !hidden,
												then: common.variant({
													if:
														(distance === 0 || distance === 1) &&
														iteration10OpeningStatus &&
														rowIndex === CENTER_ROW,
													then: {
														opacity: model.iteration10.opening.progress
															.to(interpolators.toEased("easeInOutQuart"))
															.to(interpolators.toScaledOn(0.96))
															.to(interpolators.toInverted),
														background: "red",
													},
													else: common.variant({
														if: distance !== 0,
														then: {
															opacity: model.iteration9.closing.progress
																.to(interpolators.toEased("easeInOutQuart"))
																.to(
																	interpolators.toRanged(
																		normalizedInvertDistance,
																		math.clamp(normalizedInvertDistance + 0.15, 0, 1)
																	)
																),
															z: model.iteration9.closing.progress
																.to(interpolators.toEased("easeInOutQuart"))
																.to(interpolators.toRanged(normalizedInvertDistance, 1))
																.to(interpolators.toInverted)
																.to(interpolators.toScaledOn(PERSPECTIVE * 0.75)),
														},
														else: {
															opacity: model.iteration9.closing.progress
																.to(interpolators.toStepped(0.999))
																.to(interpolators.toEased("easeInOutCubic")),
														},
													}),
												}),
												else: {},
											})
										)}
									/>
								</S.PresentationWrapper>
							</S.PresentationGroup>
						);
					})}
				</S.Row>
			))}
		</S.Layer>
	);
};

const Description = () => {
	const isVisible = useUnit(model.$iteration10Status);
	const iteration10OpeningStatus = useUnit(model.$iteration10.opening.$inFlight);

	return (
		<VisibilityToggler isHidden={!isVisible}>
			<S.Layer>
				<S.Description
					isOpening={iteration10OpeningStatus}
					words={["We have thousands", "of slides behind"]}
					openingProgress={model.iteration10.opening.progress.to(
						interpolators.toEased("easeInOutCubic")
					)}
					closingProgress={model.iteration10.closing.progress.to(
						interpolators.toEased("easeInOutCubic")
					)}
				/>
			</S.Layer>
		</VisibilityToggler>
	);
};

const PERSPECTIVE = 10;

function getOrigin(rowIndex: number, columnIndex: number, centerColumn: number, centerRow: number) {
	const diffColumnIndex = columnIndex - centerColumn;
	const diffRowIndex = rowIndex - centerRow;

	return `${
		50 - 120 * Math.ceil(Math.abs(diffColumnIndex) / centerColumn) * Math.sign(diffColumnIndex)
	}% ${50 - 120 * (diffRowIndex / centerRow)}%`;
}

function getDistanceFromCenter(
	rowIndex: number,
	columnIndex: number,
	centerColumn: number,
	centerRow: number
) {
	return Math.abs(centerColumn - columnIndex) + Math.abs(centerRow - rowIndex);
}
