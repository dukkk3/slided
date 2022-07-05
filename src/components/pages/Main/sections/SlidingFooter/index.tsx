import { forwardRef } from "react";

import { Footer } from "@components/containers/layout/Footer";

import { Iteration } from "@components/common/hoc/Iteration";

import { useIterationsControls } from "@core/hooks/useIterationsControls";
import { interpolations } from "@core/helpers/iteration.helper";

import * as S from "./styled";

export const SlidingFooter = forwardRef<HTMLDivElement>((_, ref) => {
	const iterationsControls = useIterationsControls();

	return (
		<Iteration
			iterations={iterationsControls.iterations - 1}
			checkForVisible={([lastIteration]) => lastIteration.started()}>
			{([lastIteration]) => (
				<S.SlidingFooter
					style={{
						y: lastIteration.interpolations.closing
							.to(interpolations.easing("easeInOutCubic"))
							.to(interpolations.invert)
							.to((value) => `${100 * value}%`),
					}}>
					<Footer scrollingElementRef={ref} />
				</S.SlidingFooter>
			)}
		</Iteration>
	);
});
