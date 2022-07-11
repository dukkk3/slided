import { useContext, useMemo } from "react";
import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/common/hoc/Iteration";

import { VisibilitySwitch } from "@components/common/ui/VisibilitySwitch";
import { Image } from "@components/common/ui/Image";

import { useBreakpoint } from "@core/hooks/useBreakpoint";
import { interpolations } from "@core/helpers/iteration.helper";
import { clamp } from "@core/utils/math.utils";

import { AnimatedSplitChars } from "../../helpers/AnimatedSplitChars";
import { context as promoContext } from "../../index";

import * as S from "./styled";

export interface Props {
	templatesSources: string[][];
	hidden?: boolean;
}

export const GridTemplates: React.FC<Props> = ({ templatesSources, hidden }) => {
	const breakpoint = useBreakpoint();
	const promoStore = useContext(promoContext);
	const cellsAmount = useMemo(() => templatesSources.flat(Infinity).length, [templatesSources]);
	const centerColumn = useMemo(() => (templatesSources[0].length - 1) / 2, [templatesSources]);
	const centerRow = useMemo(() => (templatesSources.length - 1) / 2, [templatesSources]);
	const maxDistance = useMemo(
		() => getDistanceFromCenter(0, 0, centerColumn, centerRow),
		[centerColumn, centerRow]
	);

	return (
		<Iteration
			iterations={[9, 10]}
			checkForVisible={([iteration9, iteration10]) =>
				hidden ? false : iteration9.closeStarted() && !iteration10.ended()
			}
			visibilitySwitch={{ unmountWhenInvisible: false }}>
			{([iteration9, iteration10]) => (
				<S.GridTemplates
					style={
						!hidden
							? {
									y: iteration10.interpolations.closing
										.to(interpolations.easing("easeInOutCubic"))
										.to((value) => `${-50 * value}%`),
									opacity: iteration10.interpolations.closing
										.to(interpolations.easing("easeInOutCubic"))
										.to(interpolations.invert),
							  }
							: {}
					}>
					<Observer>
						{() => (
							<S.Layer>
								{templatesSources.map((row, rowIndex) => (
									<S.Row key={rowIndex}>
										{row.map((templateSource, templateIndex) => {
											const distance = getDistanceFromCenter(rowIndex, templateIndex, centerColumn, centerRow);
											const origin = getOrigin(rowIndex, templateIndex, centerColumn, centerRow);
											const invertDistance = maxDistance - distance;
											const normalizedInvertDistance = invertDistance / maxDistance;
											const containsText =
												!hidden &&
												(breakpoint.mobile() || breakpoint.tablet()) &&
												rowIndex === 0 &&
												distance === 1;

											return (
												<S.TemplateGroup
													key={templateIndex}
													style={{
														zIndex: cellsAmount - Math.round(distance),
													}}>
													<S.TemplateWrapper
														style={{ perspective: `${PERSPECTIVE}rem`, perspectiveOrigin: origin }}>
														{rowIndex === centerRow && templateIndex === centerColumn && (
															<VisibilitySwitch visible={false} unmountWhenInvisible={false}>
																<S.Template
																	ref={
																		hidden ? promoStore.transforms.phoneTemplateAndGridTemplate.endRef : undefined
																	}
																	style={{
																		...promoStore.resizeObservers.phoneCard.getSize(),
																	}}
																	$overlay
																/>
															</VisibilitySwitch>
														)}
														<S.Template
															$containsText={containsText}
															style={{
																...promoStore.resizeObservers.phoneCard.getSize(),
																...(!hidden
																	? iteration10.started() &&
																	  (distance === 0 || distance === 1) &&
																	  !breakpoint.range("mobile", "tablet") &&
																	  rowIndex === centerRow
																		? {
																				opacity: iteration10.interpolations.opening
																					.to(interpolations.easing("easeInOutQuart"))
																					.to((value) => 1 - 0.96 * value),
																		  }
																		: distance !== 0
																		? {
																				opacity: iteration9.interpolations.closing
																					.to(interpolations.easing("easeInOutQuart"))
																					.to(
																						interpolations.range(
																							normalizedInvertDistance,
																							clamp(normalizedInvertDistance + 0.15, 0, 1)
																						)
																					),
																				z: iteration9.interpolations.closing
																					.to(interpolations.easing("easeInOutQuart"))
																					.to(interpolations.range(normalizedInvertDistance, 1))
																					.to(interpolations.invert)
																					.to((value) => `${PERSPECTIVE * 0.75 * value}rem`),
																		  }
																		: {
																				opacity: iteration9.interpolations.closing
																					.to(interpolations.step(0.999))
																					.to(interpolations.easing("easeInOutCubic")),
																		  }
																	: {}),
															}}>
															{!hidden && !containsText && <Image src={templateSource} lazy={false} />}
															{containsText && (
																<p>
																	We have
																	<br />
																	thousands of slides
																	<br />
																	behind
																</p>
															)}
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
					<Observer>
						{() => (
							<>
								{!hidden && !breakpoint.mobile() && (
									<VisibilitySwitch visible={iteration10.visible()}>
										<S.Layer>
											<S.Title>
												<AnimatedSplitChars
													type={iteration10.visible("opening") ? "opening" : "closing"}
													text={["We have thousands", "of slides behind"]}
													openingInterpolation={iteration10.interpolations.opening.to(
														interpolations.easing("easeInOutCubic")
													)}
													closingInterpolation={iteration10.interpolations.closing.to(
														interpolations.easing("easeInOutCubic")
													)}
												/>
											</S.Title>
										</S.Layer>
									</VisibilitySwitch>
								)}
							</>
						)}
					</Observer>
				</S.GridTemplates>
			)}
		</Iteration>
	);
};

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
