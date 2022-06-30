import { memo } from "react";

import { Iteration } from "@components/common/hoc/Iteration";

import { useBreakpoint } from "@core/hooks";
import { createArray } from "@core/utils";

import { getVectorImageByName } from "@assets/images";

import * as S from "./styled";

export const Tariff: React.FC = memo(() => {
	const breakpoint = useBreakpoint();

	return (
		<Iteration iterations={11}>
			{([iteration11], interpolations) => (
				<S.Tariff>
					<S.Head
						style={{
							opacity: iteration11.interpolations.opening.to(interpolations.easing("easeInOutCubic")),
							y: iteration11.interpolations.opening
								.to(interpolations.easing("easeInOutCubic"))
								.to(interpolations.invert)
								.to((value) => `${10 * value}rem`),
						}}>
						{breakpoint.range("mobile", "tablet") ? (
							<S.Title>
								One
								<br /> subscription
							</S.Title>
						) : (
							<S.Title>One subscription</S.Title>
						)}
						{breakpoint.range("mobile", "tablet") && (
							<S.Subtitle>
								Up to 40 slides,
								<br />
								PDF and source file included
							</S.Subtitle>
						)}
					</S.Head>
					<S.Body>
						<S.Ray>
							{createArray(3).map((_, index) => (
								<S.RayPiece
									key={index}
									style={{
										scale: iteration11.interpolations.opening
											.to(interpolations.easing("easeInOutCubic"))
											.to(interpolations.range(index / 3, 1)),
									}}>
									{getVectorImageByName("common", "LogoRayPiece")}
								</S.RayPiece>
							))}
						</S.Ray>
						<S.Price
							style={{
								opacity: iteration11.interpolations.opening.to(interpolations.easing("easeInOutCubic")),
								y: iteration11.interpolations.opening
									.to(interpolations.easing("easeInOutCubic"))
									.to(interpolations.invert)
									.to((value) => `${10 * value}rem`),
							}}>
							<S.PriceContent>{getVectorImageByName("common", "PlanContent")}</S.PriceContent>
						</S.Price>
					</S.Body>
				</S.Tariff>
			)}
		</Iteration>
	);
});
