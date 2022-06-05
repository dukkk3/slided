import { memo } from "react";
import { Observer } from "mobx-react-lite";

import { VisibilitySwitch } from "@components/common/hoc/VisibilitySwitch";

import { Image } from "@components/common/ui/Image";

import { clamp, step, createArray } from "@core/utils";
import { useIteration, useIterationControls } from "@core/hooks";

import { getRasterImageByName } from "@assets/images";

import * as S from "./styled";

export interface Props {
	centerTemplateRef?: React.ForwardedRef<any>;
	empty?: boolean;
}

export const TemplatesGrid: React.FC<Props> = memo(({ centerTemplateRef, empty = false }) => {
	const iteration9 = useIteration(9);
	const iteration10 = useIteration(10);
	const iterationControls = useIterationControls();

	return (
		<Observer>
			{() => (
				<S.TemplatesGrid>
					{ROWS.map((row, rowIndex) => (
						<S.TemplatesRow key={rowIndex}>
							{row.map((templateSource, templateIndex) => {
								const distance = getDistanceFromCenter(rowIndex, templateIndex);
								const invertDistance = MAX_DISTANCE - distance;
								const normalizedInvertDistance = invertDistance / MAX_DISTANCE;
								const origin = getOrigin(rowIndex, templateIndex);

								return (
									<S.TemplateGroup
										key={templateIndex}
										style={{
											zIndex: CELLS_AMOUNT - Math.round(distance),
										}}>
										<S.TemplateWrapper
											style={{ perspective: `${PERSPECTIVE}rem`, perspectiveOrigin: origin }}>
											{!empty && rowIndex === CENTER_ROW && templateIndex === CENTER_COLUMN && (
												<VisibilitySwitch visible={false}>
													<S.Template ref={centerTemplateRef} $overlay />
												</VisibilitySwitch>
											)}
											<S.Template
												style={
													!empty
														? iteration10.started() &&
														  (distance === 0 || distance === 1) &&
														  rowIndex === CENTER_ROW
															? {
																	opacity: iteration10.interpolations.opening
																		.to((value) => iterationControls.toRange(value, 0, 0.5))
																		.to((value) => 1 - 0.9 * value),
															  }
															: distance !== 0
															? {
																	opacity: iteration9.interpolations.closing.to((value) =>
																		iterationControls.toRange(
																			value,
																			normalizedInvertDistance,
																			clamp(normalizedInvertDistance + 0.15, 0, 1)
																		)
																	),
																	z: iteration9.interpolations.closing
																		.to((value) => iterationControls.toRange(value, normalizedInvertDistance, 1))
																		.to((value) => `${PERSPECTIVE * 0.75 * (1 - value)}rem`),
															  }
															: {
																	opacity: iteration9.interpolations.closing
																		.to((value) => step(value, 0.99))
																		.to((value) => value),
															  }
														: {}
												}>
												{!empty && <Image src={templateSource} />}
											</S.Template>
										</S.TemplateWrapper>
									</S.TemplateGroup>
								);
							})}
						</S.TemplatesRow>
					))}
				</S.TemplatesGrid>
			)}
		</Observer>
	);
});

const ROWS = [
	createArray(5)
		.map(() => "")
		.fill(getRasterImageByName("BlackTemplateSource")),
	[
		getRasterImageByName("BlueTemplateSource"),
		getRasterImageByName("SilverTemplateSource"),
		getRasterImageByName("CarTemplateSource"),
		getRasterImageByName("BlueTemplateSource"),
		getRasterImageByName("SilverTemplateSource"),
	],
	createArray(5)
		.map(() => "")
		.fill(getRasterImageByName("GreenTemplateSource")),
];

const ROWS_AMOUNT = ROWS.length;
const COLUMNS_AMOUNT = ROWS[0].length;
const CELLS_AMOUNT = ROWS_AMOUNT * COLUMNS_AMOUNT;

const CENTER_ROW = (ROWS_AMOUNT - 1) / 2;
const CENTER_COLUMN = (COLUMNS_AMOUNT - 1) / 2;

const MAX_DISTANCE = getDistanceFromCenter(0, 0) + 1;
const PERSPECTIVE = 1;

function getOrigin(rowIndex: number, columnIndex: number) {
	const diffColumnIndex = columnIndex - CENTER_COLUMN;
	const diffRowIndex = rowIndex - CENTER_ROW;
	return `${
		50 - 125 * (Math.round(Math.abs(diffColumnIndex / CENTER_COLUMN)) * Math.sign(diffColumnIndex))
	}% ${50 - 125 * (diffRowIndex / CENTER_ROW)}%`;
}

function getDistanceFromCenter(rowIndex: number, columnIndex: number) {
	return Math.abs(CENTER_COLUMN - columnIndex) + Math.abs(CENTER_ROW - rowIndex);
}
