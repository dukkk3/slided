import { memo } from "react";

import { useIteration, useIterationControls } from "@core/hooks";
import { createArray } from "@core/utils";

import { getVectorImageByName } from "@assets/images";

import * as S from "./styled";

export const Tariff: React.FC = memo(() => {
	const iteration11 = useIteration(11);
	const iterationControls = useIterationControls();

	return (
		<S.Tariff>
			<S.Title
				style={{
					opacity: iteration11.interpolations.opening.to((value) =>
						iterationControls.toRange(value, 0, 0.5)
					),
					y: iteration11.interpolations.opening
						.to((value) => iterationControls.toRange(value, 0, 0.5))
						.to((value) => `${10 * (1 - value)}rem`),
				}}>
				One subscription
			</S.Title>
			<S.Body>
				<S.Ray>
					{createArray(3).map((_, index) => (
						<S.RayPiece
							style={{
								scale: iteration11.interpolations.opening.to((value) =>
									iterationControls.toRange(value, index / 3, 1)
								),
							}}>
							{getVectorImageByName("common", "LogoRayPiece")}
						</S.RayPiece>
					))}
				</S.Ray>
				<S.Price
					style={{
						opacity: iteration11.interpolations.opening,
						y: iteration11.interpolations.opening.to((value) => `${10 * (1 - value)}rem`),
					}}>
					<S.PriceContent>{getVectorImageByName("common", "PlanContent")}</S.PriceContent>
				</S.Price>
			</S.Body>
		</S.Tariff>
	);
});
