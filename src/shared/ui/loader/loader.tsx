import { config, easings, useSpring } from "@react-spring/web";
import { memo, useCallback, useEffect } from "react";

import { interpolators } from "@shared/helpers";

import { AssignComponentProps } from "../assign-component-props";

import * as assets from "./assets";
import * as S from "./loader.styled";

const PIECES_COUNT = 3;
const PIECES_ARRAY = Array(PIECES_COUNT).fill(0);

export interface LoaderProps extends React.ComponentProps<"div"> {}

export const Loader = AssignComponentProps(
	memo((props: LoaderProps) => {
		const [{ progress, opacity }, api] = useSpring(() => ({ opacity: 0, progress: 0 }));

		const animate = useCallback(async () => {
			api.stop();
			api.start({
				from: { progress: 0, opacity: 1 },
				to: async (start) => {
					await start({ progress: 1, config: { duration: 1650 } });
					await start({ opacity: 0, config: config.slow });
				},
				loop: true,
			});
		}, [api]);

		useEffect(() => {
			animate();
		}, [animate]);

		return (
			<S.Loader {...props}>
				<S.PieceGroup style={{ opacity }}>
					{PIECES_ARRAY.map((_, index) => (
						<S.Piece key={index} style={{ zIndex: PIECES_COUNT - index }}>
							<S.PieceContent
								style={{
									scaleX: progress
										.to(interpolators.toRanged(index / PIECES_COUNT, (index + 1) / PIECES_COUNT))
										.to({ output: [0, 1], range: [0, 1], easing: easings.easeInOutCubic }),
								}}
							/>
						</S.Piece>
					))}
				</S.PieceGroup>
				<S.Logo src={assets.logo} />
			</S.Loader>
		);
	}),
	{ S }
);
