import React, { useCallback, useEffect } from "react";
import { useSpring } from "react-spring";
import { Observer } from "mobx-react-lite";
import { reaction } from "mobx";

import { Header } from "@components/containers/layout/Header";
// import { Footer } from "@components/containers/layout/Footer";
// import { Feedback } from "@components/containers/layout/Feedback";

import { ScrollControls } from "@components/common/hoc/ScrollControls";
import { IterationControls } from "@components/common/hoc/IterationControls";

import { useGlobalStore, useResizeObserver } from "@core/hooks";

import * as S from "./styled";

export interface Props extends React.PropsWithChildren<{}> {}

export const Layout: React.FC<Props> = ({ children }) => {
	const promoStore = useGlobalStore((store) => store.layout.promo);
	const layoutStore = useGlobalStore((store) => store.layout);
	const headerResizeObserver = useResizeObserver({ calculateSizeWithPaddings: true });
	const [feedbackStyle, feedbackApi] = useSpring(() => ({ y: "100%" }));

	const updateCSSProperties = useCallback(() => {
		const { height: headerHeight, width: headerWidth } = headerResizeObserver.getSize();

		document.body.style.setProperty("--header-height", `${headerHeight}px`);
		document.body.style.setProperty("--header-width", `${headerWidth}px`);
	}, [headerResizeObserver]);

	useEffect(
		() =>
			reaction(
				() => layoutStore.feedbackOpened,
				(opened) => {
					feedbackApi.start({ y: opened ? "0%" : "100%" });
				}
			),
		[feedbackApi, layoutStore]
	);

	useEffect(
		() =>
			reaction(
				() => headerResizeObserver.getSize(),
				() => updateCSSProperties()
			),
		[headerResizeObserver, updateCSSProperties]
	);

	return (
		<S.Layout>
			<S.FeedbackWrapper style={feedbackStyle}>{/* <Feedback /> */}</S.FeedbackWrapper>
			<S.HeaderWrapper ref={headerResizeObserver.ref}>
				<Header />
			</S.HeaderWrapper>
			{/* <Footer /> */}
			{/* <Plans /> */}
			<Observer>
				{() => (
					// <IterationControls iterations={10}>{children}</IterationControls>
					<IterationControls iterations={12} enabled={promoStore.interactiveEnabled()}>
						{children}
					</IterationControls>
				)}
			</Observer>
		</S.Layout>
	);
};
