import { Iteration } from "@components/common/hoc/Iteration";

import { useBreakpoint } from "@core/hooks/useBreakpoint";
import { interpolations } from "@core/helpers/iteration.helper";
import { createArray } from "@core/utils/common.utils";

import { getVectorImageByName } from "@assets/images";

import * as S from "./styled";

export const Tariffs: React.FC = () => {
	const breakpoint = useBreakpoint();

	return (
		<Iteration iterations={11} visibilitySwitch={{ unmountWhenInvisible: false }}>
			{([iteration11]) => (
				<S.Tariffs data-iteration-name='Tariffs'>
					<S.Head
						style={{
							opacity: iteration11.interpolations.opening.to(interpolations.easing("easeInOutCubic")),
							y: iteration11.interpolations.opening
								.to(interpolations.easing("easeInOutCubic"))
								.to(interpolations.invert)
								.to((value) => `${10 * value}rem`),
						}}>
						<S.Title>One subscription</S.Title>
						{breakpoint.mobile() && (
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
											.to(interpolations.range(index / 3, 1))
											.to(interpolations.easing("easeInOutCubic")),
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
				</S.Tariffs>
			)}
		</Iteration>
	);
};
