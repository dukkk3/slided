import { forwardRef, useEffect } from "react";

import { Footer } from "@components/containers/layout/Footer";

import { Iteration } from "@components/common/hoc/Iteration";

import { useIterationsControls } from "@core/hooks/useIterationsControls";
import { interpolations } from "@core/helpers/iteration.helper";

import * as S from "./styled";
import { useSpring } from "react-spring";
import { useGlobalStore } from "@core/hooks/useGlobalStore";
import { reaction } from "mobx";

export const SlidingFooter = forwardRef<HTMLDivElement>((_, ref) => {
	const iterationsControls = useIterationsControls();
	const layoutStore = useGlobalStore((store) => store.layout);
	const [footerGroupStyle, footerGroupApi] = useSpring(() => ({ y: "0%", opacity: 1 }));

	useEffect(
		() =>
			reaction(
				() => layoutStore.feedbackOpened,
				(opened) => {
					footerGroupApi.start({ y: opened ? "100%" : "0%" });
				}
			),
		[footerGroupApi, layoutStore.feedbackOpened]
	);

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
					<S.FooterGroup style={footerGroupStyle}>
						<Footer scrollingElementRef={ref} />
					</S.FooterGroup>
				</S.SlidingFooter>
			)}
		</Iteration>
	);
});
