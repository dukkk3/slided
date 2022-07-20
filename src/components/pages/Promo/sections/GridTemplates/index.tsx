import { useEffect, useMemo, useRef, memo, useCallback } from "react";
import { Observer } from "mobx-react-lite";
import { useSpring } from "react-spring";
import { useGesture } from "@use-gesture/react";

import { useIterationsControls } from "@components/providers/IterationsControlsProvider";

import { Iteration } from "@components/pages/Promo/helpers/Iteration";

import { VisibilitySwitch } from "@components/common/ui/VisibilitySwitch";
import { ArrowsIcon } from "@components/common/ui/ArrowsIcon";
import { Image } from "@components/common/ui/Image";

import { useBreakpoint } from "@core/hooks/useBreakpoint";
import { interpolations } from "@core/helpers/iteration.helper";
import { clamp } from "@core/utils/math.utils";

import { AnimatedSplitChars } from "../../helpers/AnimatedSplitChars";
import { usePromo } from "../../index";

import * as S from "./styled";

export interface Props {
	templatesSources: string[][];
	hidden?: boolean;
}

export const GridTemplates: React.FC<Props> = memo(({ templatesSources, hidden }) => {
	const promo = usePromo();
	const breakpoint = useBreakpoint();
	const translateRef = useRef(0);
	const iterationsControls = useIterationsControls();
	const [gridStyle, gridApi] = useSpring(() => ({ x: 0 }));

	const cellsAmount = useMemo(() => templatesSources.flat(Infinity).length, [templatesSources]);
	const centerColumn = useMemo(() => (templatesSources[0].length - 1) / 2, [templatesSources]);
	const centerRow = useMemo(() => (templatesSources.length - 1) / 2, [templatesSources]);
	const maxDistance = useMemo(
		() => getDistanceFromCenter(0, 0, centerColumn, centerRow),
		[centerColumn, centerRow]
	);

	const animateScroll = useCallback(
		(dx: number, factor: number = 1) => {
			if (hidden || !iterationsControls.store.compare(10, "equal")) return;

			const rowWidth = promo.resizeObservers.gridRow.getSize().width;
			const rowOutsideOfWindow = rowWidth > window.innerWidth;

			if (!rowOutsideOfWindow) return;
			const diff = Math.abs(rowWidth - window.innerWidth) / 2;
			const translate = clamp(translateRef.current + dx * factor, -diff, diff);

			gridApi.start({
				x: translate,
			});

			translateRef.current = translate;
		},
		[gridApi, hidden, iterationsControls.store, promo.resizeObservers.gridRow]
	);

	const bindGesture = useGesture(
		{
			onScroll: ({ delta: [dx] }) => animateScroll(dx),
			onWheel: ({ delta: [dx] }) => animateScroll(dx * -1),
			onDrag: ({ delta: [dx] }) => animateScroll(dx, 1.4),
		},
		{ wheel: { axis: "x", preventDefault: true }, drag: { axis: "x", preventDefault: true } }
	);

	useEffect(
		() =>
			iterationsControls.addPartChangeListener(() => {
				translateRef.current = 0;
				gridApi.start({ x: 0 });
			}),
		[gridApi, iterationsControls]
	);

	return (
		<>
			<Iteration
				iterations={[9, 10]}
				checkForVisible={([iteration9, iteration10]) =>
					!hidden && iteration9.closeStarted() && !iteration10.ended()
				}>
				{([iteration9, iteration10]) => (
					<div>
						<S.GridTemplates
							{...(!hidden ? bindGesture() : {})}
							// ref={!hidden ? gridRef : undefined}
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
											<S.Row
												key={rowIndex}
												ref={hidden && rowIndex === 0 ? promo.resizeObservers.gridRow.ref : undefined}
												style={
													!hidden ? { x: gridStyle.x.to((value) => (rowIndex % 2 === 0 ? -value : value)) } : {}
												}>
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
																{hidden && rowIndex === centerRow && templateIndex === centerColumn && (
																	<VisibilitySwitch visible={false}>
																		<S.Template
																			ref={promo.transforms.phoneTemplateAndGridTemplate.endRef}
																			style={{
																				...promo.resizeObservers.phoneCard.getSize(),
																			}}
																			$overlay
																		/>
																	</VisibilitySwitch>
																)}
																<S.Template
																	$containsText={containsText}
																	style={{
																		...promo.resizeObservers.phoneCard.getSize(),
																		...(!hidden
																			? iteration10.started() &&
																			  (distance === 0 || distance === 1) &&
																			  !(breakpoint.mobile() || breakpoint.tablet()) &&
																			  rowIndex === centerRow
																				? {
																						background: "blue",
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
										{breakpoint.mobile() ? (
											<S.ArrowsIconGroup
												style={{
													opacity: iteration9.interpolations.closing
														.to(interpolations.range(0.65, 1))
														.to(interpolations.easing("easeInOutQuart")),
												}}>
												<ArrowsIcon />
											</S.ArrowsIconGroup>
										) : null}
									</S.Layer>
								)}
							</Observer>
							<Observer>
								{() => (
									<>
										{!hidden && !(breakpoint.mobile() || breakpoint.tablet()) && (
											<VisibilitySwitch visible={iteration10.visible()} interactive={false}>
												<S.Layer style={!hidden ? { x: gridStyle.x } : {}}>
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
					</div>
				)}
			</Iteration>
		</>
	);
});

const PERSPECTIVE = 1;

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
