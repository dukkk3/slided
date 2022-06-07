import { memo } from "react";

import { Iteration } from "@components/common/hoc/Iteration";

import { createArray, toRange } from "@core/utils";

import { getVectorImageByName } from "@assets/images";

import * as S from "./styled";

export const Tariff: React.FC = memo(() => {
	return (
		<Iteration iteration={11}>
			{(iteration11) => (
				<S.Tariff>
					<S.Title
						style={{
							opacity: iteration11.interpolations.toEasing("easeInOutCubic").opening,
							y: iteration11.interpolations
								.toEasing("easeInOutCubic")
								.opening.to((value) => `${10 * (1 - value)}rem`),
						}}>
						One subscription
					</S.Title>
					<S.Body>
						<S.Ray>
							{createArray(3).map((_, index) => (
								<S.RayPiece
									key={index}
									style={{
										scale: iteration11.interpolations
											.toEasing("easeInOutCubic")
											.opening.to((value) => toRange(value, index / 3, 1)),
									}}>
									{getVectorImageByName("common", "LogoRayPiece")}
								</S.RayPiece>
							))}
						</S.Ray>
						<S.Price
							style={{
								opacity: iteration11.interpolations.toEasing("easeInOutCubic").opening,
								y: iteration11.interpolations
									.toEasing("easeInOutCubic")
									.opening.to((value) => `${10 * (1 - value)}rem`),
							}}>
							<S.PriceContent>{getVectorImageByName("common", "PlanContent")}</S.PriceContent>
						</S.Price>
					</S.Body>
				</S.Tariff>
			)}
		</Iteration>
	);
});
