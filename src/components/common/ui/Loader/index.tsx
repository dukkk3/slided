import { memo, useCallback, useEffect } from "react";
import { config, easings, useSpring } from "react-spring";

import { createArray } from "@core/utils";

import { getVectorImageByName } from "@assets/images";

import { animationHelper } from "@core/helpers";
import { toRange } from "@core/utils";

import * as S from "./styled";

export const Loader: React.FC = memo(() => {
	const [{ scale, opacity }, api] = useSpring(() => ({ scale: 0, opacity: 0 }));

	const animate = useCallback(async () => {
		api.set({ opacity: 1 });

		await animationHelper.resolveSpringAnimation(api, {
			scale: 1,
			config: { duration: 1900 },
			// config: { friction: 50, tension: 150 },
		});
		await animationHelper.resolveSpringAnimation(api, { opacity: 0, config: config.slow });

		api.set({ scale: 0 });

		animate();
	}, [api]);

	useEffect(() => {
		animate();
	}, [animate]);

	return (
		<S.Loader>
			<S.PieceGroup style={{ opacity: opacity }}>
				{createArray(3).map((_, index) => (
					<S.Piece key={index} style={{ zIndex: 3 - index }}>
						<S.PieceContent
							style={{
								scaleX: scale
									.to((value) => toRange(value, index / 3, (index + 1) / 3))
									.to({ output: [0, 1], range: [0, 1], easing: easings.easeInOutCubic }),
							}}
						/>
						{/* {getVectorImageByName("common", "LogoRayPiece")} */}
					</S.Piece>
				))}
			</S.PieceGroup>
			<S.Title>{getVectorImageByName("common", "Slided")}</S.Title>
		</S.Loader>
	);
});
