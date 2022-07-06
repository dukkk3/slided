import React, { useCallback, useEffect } from "react";
import { useSpring } from "react-spring";
import { Observer } from "mobx-react-lite";
import { reaction, when } from "mobx";

import { Header } from "@components/containers/layout/Header";
import { Feedback } from "@components/containers/layout/Feedback";
// import { Footer } from "@components/containers/layout/Footer";

import { IterationsControls } from "@components/common/hoc/IterationsControls";

import { useResizeObserver } from "@core/hooks/useResizeObserver";
import { useGlobalStore } from "@core/hooks/useGlobalStore";

import * as S from "./styled";

export interface Props extends React.PropsWithChildren<{}> {}

export const Layout: React.FC<Props> = ({ children }) => {
	const promoStore = useGlobalStore((store) => store.layout.promo);
	const layoutStore = useGlobalStore((store) => store.layout);
	const headerResizeObserver = useResizeObserver({
		calculateSizeWithPaddings: true,
		debounce: 100,
		withOffset: false,
	});
	const [feedbackStyle, feedbackApi] = useSpring(() => ({ y: "100%", opacity: 0 }));
	const [headerStyle, headerApi] = useSpring(() => ({ opacity: 0 }));

	const updateCSSProperties = useCallback(() => {
		const { height: headerHeight, width: headerWidth } = headerResizeObserver.getSize();

		document.body.style.setProperty("--header-height", `${headerHeight}px`);
		document.body.style.setProperty("--header-width", `${headerWidth}px`);
	}, [headerResizeObserver]);

	useEffect(
		() =>
			reaction(
				() => layoutStore.feedbackOpened,
				(opened) => feedbackApi.start({ y: opened ? "0%" : "100%", opacity: opened ? 1 : 0 })
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

	useEffect(
		() =>
			when(
				() => promoStore.canShowContent,
				() => headerApi.start({ opacity: 1 })
			),
		[headerApi, promoStore]
	);

	useEffect(() => {
		updateCSSProperties();
	}, [updateCSSProperties]);

	return (
		<S.Layout>
			<S.FeedbackWrapper style={feedbackStyle}>{/* <Feedback /> */}</S.FeedbackWrapper>
			<S.HeaderWrapper ref={headerResizeObserver.ref} style={headerStyle}>
				<Header />
			</S.HeaderWrapper>
			{/* <Footer /> */}
			{/* <Plans /> */}
			<Observer>
				{() => (
					// <IterationControls iterations={10}>{children}</IterationControls>
					<IterationsControls iterations={12} enabled={promoStore.interactiveEnabled}>
						{children}
					</IterationsControls>
				)}
			</Observer>
			<S.FeedbackWrapper style={feedbackStyle}>
				<Feedback />
			</S.FeedbackWrapper>
		</S.Layout>
	);
};
