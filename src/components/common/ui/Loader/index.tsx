import { memo, useCallback, useEffect } from "react";
import { config, easings, useSpring } from "react-spring";

import { getVectorImageByName } from "@assets/images";

import { resolveSpringAnimation } from "@core/helpers/animation.helper";
import { toRange } from "@core/utils/math.utils";
import { createArray } from "@core/utils/common.utils";

import * as S from "./styled";

export interface Props {
	onAnimationEnded?: () => void;
}

export const Loader: React.FC<Props> = memo(({ onAnimationEnded }) => {
	const [{ scale, opacity }, api] = useSpring(() => ({ scale: 0, opacity: 0 }));

	const animate = useCallback(async () => {
		api.set({ opacity: 1 });

		await resolveSpringAnimation(api, {
			scale: 1,
			config: { duration: 1650 },
			// config: { friction: 50, tension: 150 },
		});

		if (onAnimationEnded) {
			onAnimationEnded();
		}

		await resolveSpringAnimation(api, { opacity: 0, config: config.slow });

		api.set({ scale: 0 });

		animate();
	}, [api, onAnimationEnded]);

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
