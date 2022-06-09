import { memo, useMemo } from "react";
import { Observer } from "mobx-react-lite";

import { VisibilitySwitch } from "@components/common/hoc/VisibilitySwitch";
import { Iteration } from "@components/common/hoc/Iteration";

import { AnimatedSplitChars } from "@components/common/ordinary/AnimatedSplitChars";

import { Image } from "@components/common/ui/Image";

import { clamp, inlineSwitch, toRange, step } from "@core/utils";

import * as S from "./styled";

export interface Props {
	templates: string[][];
	templateContainerRef?: React.ForwardedRef<any>;
	hidden?: boolean;
}

export const TemplatesGrid: React.FC<Props> = memo(
	({ templates, templateContainerRef, hidden }) => {
		const cellsAmount = useMemo(() => templates.flat(Infinity).length, [templates]);
		const centerColumn = useMemo(() => (templates[0].length - 1) / 2, [templates]);
		const centerRow = useMemo(() => (templates.length - 1) / 2, [templates]);
		const maxDistance = useMemo(
			() => getDistanceFromCenter(0, 0, centerColumn, centerRow),
			[centerColumn, centerRow]
		);

		return (
			<Iteration
				iteration={[9, 10]}
				visibleCondition={(iteration9, iteration10) =>
					hidden ? false : iteration9.startClosed() && !iteration10.ended()
				}>
				{(iteration9, iteration10) => (
					<S.TemplatesGrid
						style={inlineSwitch(
							!hidden,
							{
								y: iteration10.interpolations
									.toEasing("easeInOutCubic")
									.closing.to((value) => `${-50 * value}%`),
								opacity: iteration10.interpolations
									.toEasing("easeInOutCubic")
									.closing.to((value) => 1 - value),
							},
							{}
						)}>
						<Observer>
							{() => (
								<S.Layer>
									{templates.map((row, rowIndex) => (
										<S.Row key={rowIndex}>
											{row.map((templateSource, templateIndex) => {
												const distance = getDistanceFromCenter(
													rowIndex,
													templateIndex,
													centerColumn,
													centerRow
												);
												const origin = getOrigin(rowIndex, templateIndex, centerColumn, centerRow);
												const invertDistance = maxDistance - distance;
												const normalizedInvertDistance = invertDistance / maxDistance;

												return (
													<S.TemplateGroup
														key={templateIndex}
														style={{
															zIndex: cellsAmount - Math.round(distance),
														}}>
														<S.TemplateWrapper
															style={{ perspective: `${PERSPECTIVE}rem`, perspectiveOrigin: origin }}>
															{rowIndex === centerRow && templateIndex === centerColumn && (
																<VisibilitySwitch visible={false}>
																	<S.Template ref={templateContainerRef} $overlay />
																</VisibilitySwitch>
															)}
															<S.Template
																style={inlineSwitch(
																	!hidden,
																	inlineSwitch(
																		iteration10.started() &&
																			(distance === 0 || distance === 1) &&
																			rowIndex === centerRow,
																		{
																			opacity: iteration10.interpolations
																				.toEasing("easeInOutQuart")
																				.opening.to((value) => 1 - 0.9 * value),
																		},
																		inlineSwitch(
																			distance !== 0,
																			{
																				opacity: iteration9.interpolations
																					.toEasing("easeInOutQuart")
																					.closing.to((value) =>
																						toRange(
																							value,
																							normalizedInvertDistance,
																							clamp(normalizedInvertDistance + 0.15, 0, 1)
																						)
																					),
																				z: iteration9.interpolations
																					.toEasing("easeInOutQuart")
																					.closing.to((value) => toRange(value, normalizedInvertDistance, 1))
																					.to((value) => `${PERSPECTIVE * 0.75 * (1 - value)}rem`),
																			},
																			{
																				opacity: iteration9.interpolations
																					.toEasing("easeInOutCubic")
																					.closing.to((value) => step(value, 1))
																					.to((value) => value),
																			}
																		)
																	),
																	undefined
																)}>
																{!hidden && <Image src={templateSource} lazy={false} />}
															</S.Template>
														</S.TemplateWrapper>
													</S.TemplateGroup>
												);
											})}
										</S.Row>
									))}
								</S.Layer>
							)}
						</Observer>
						{!hidden && (
							<S.Layer>
								<S.Title>
									<Observer>
										{() => (
											<VisibilitySwitch visible={iteration10.visible()}>
												<AnimatedSplitChars
													type={iteration10.visible("opening") ? "opening" : "closing"}
													content={["We have thousands", "of slides behind"]}
													openingInterpolation={iteration10.interpolations.toEasing("easeInOutCubic").opening}
													closingInterpolation={iteration10.interpolations.toEasing("easeInOutCubic").closing}
												/>
											</VisibilitySwitch>
										)}
									</Observer>
								</S.Title>
							</S.Layer>
						)}
					</S.TemplatesGrid>
				)}
			</Iteration>
		);
	}
);

const PERSPECTIVE = 1;

function getOrigin(rowIndex: number, columnIndex: number, centerColumn: number, centerRow: number) {
	const diffColumnIndex = columnIndex - centerColumn;
	const diffRowIndex = rowIndex - centerRow;
	return `${
		50 - 125 * (Math.round(Math.abs(diffColumnIndex / centerColumn)) * Math.sign(diffColumnIndex))
	}% ${50 - 125 * (diffRowIndex / centerRow)}%`;
}

function getDistanceFromCenter(
	rowIndex: number,
	columnIndex: number,
	centerColumn: number,
	centerRow: number
) {
	return Math.abs(centerColumn - columnIndex) + Math.abs(centerRow - rowIndex);
}
