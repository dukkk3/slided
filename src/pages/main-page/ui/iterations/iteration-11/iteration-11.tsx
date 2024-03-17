import { useUnit } from "effector-react";

import { interpolators } from "@shared/helpers";
import { VisibilityToggler } from "@shared/ui";

import * as assets from "./assets";
import * as model from "./iteration-11.model";
import * as S from "./iteration-11.styled";

export const Iteration11 = () => {
	const isVisible = useUnit(model.$iteration11Status);

	return (
		<VisibilityToggler isHidden={!isVisible}>
			<S.Tariffs>
				<S.Head
					style={{
						opacity: model.iteration11.opening.progress.to(interpolators.toEased("easeInOutCubic")),
						y: model.iteration11.opening.progress
							.to(interpolators.toEased("easeInOutCubic"))
							.to(interpolators.toInverted)
							.to(interpolators.toScaledOn(100)),
					}}>
					<S.Title>One subscription</S.Title>
				</S.Head>
				<S.Body>
					<S.Ray>
						{Array(3)
							.fill(0)
							.map((_, index) => (
								<S.RayPiece
									key={index}
									style={{
										scale: model.iteration11.opening.progress
											.to(interpolators.toRanged(index / 3, 1))
											.to(interpolators.toEased("easeInOutCubic")),
									}}>
									<S.Image src={assets.ray} />
								</S.RayPiece>
							))}
					</S.Ray>
					<S.Price
						style={{
							opacity: model.iteration11.opening.progress.to(interpolators.toEased("easeInOutCubic")),
							x: "20%",
							y: model.iteration11.opening.progress
								.to(interpolators.toEased("easeInOutCubic"))
								.to(interpolators.toInverted)
								.to(interpolators.toScaledOn(100)),
						}}>
						<S.Image src={assets.planContent} />
					</S.Price>
				</S.Body>
			</S.Tariffs>
		</VisibilityToggler>
	);
};
