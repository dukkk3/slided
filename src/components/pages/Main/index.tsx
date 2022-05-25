import { useCallback, useLayoutEffect, useEffect } from "react";
import { Observer } from "mobx-react-lite";

import { Layout } from "@components/containers/layout/Layout";
import { PromoContainer } from "@components/containers/layout/PromoContainer";

import { TableBackground } from "@components/containers/sections/TableBackground";
import { PromoBannerLayer } from "@components/containers/sections/PromoBannerLayer";
import { AssistantLayer } from "@components/containers/sections/AssistantLayer";
import { PhoneLayer } from "@components/containers/sections/PhoneLayer";

import { DebugIterationControls } from "@components/common/simple/DebugIterationControls";

import { useIterationControls } from "@core/hooks";

import * as S from "./styled";

const Content: React.FC = () => {
	const iterationControls = useIterationControls();

	// const handleDocumentKeydown = useCallback(
	// 	(event: KeyboardEvent) => {
	// 		switch (event.key) {
	// 			case "ArrowDown":
	// 				return iterationControls.animate(iterationControls.getTarget() + 1);
	// 			case "ArrowUp":
	// 				return iterationControls.animate(iterationControls.getTarget() - 1);
	// 		}
	// 	},
	// 	[iterationControls]
	// );

	// useEffect(() => {
	// 	// iterationControls.set(4.5);
	// 	console.log(iterationControls.store.progress);
	// }, [iterationControls]);

	// useEffect(() => {
	// 	document.addEventListener("keydown", handleDocumentKeydown);

	// 	return () => {
	// 		document.removeEventListener("keydown", handleDocumentKeydown);
	// 	};
	// }, [handleDocumentKeydown]);

	return (
		<S.Wrapper
			style={{
				y: iterationControls.animated.scrollTop.to((value) => -value),
			}}>
			<DebugIterationControls />
			<S.TableBackgroundWrapper>
				<TableBackground />
			</S.TableBackgroundWrapper>
			<S.LayerWrapper>
				<PromoContainer>
					{[
						{
							fullscreen: true,
							component: <PromoBannerLayer />,
							isVisible: () => iterationControls.store.compare(0.5, "gt"),
						},
						{
							fullscreen: true,
							component: <PhoneLayer />,
							isVisible: () => iterationControls.store.compare(2.5, "lte"),
						},
						{
							fullscreen: false,
							component: <AssistantLayer />,
							isVisible: () => iterationControls.store.compare(0.75, "lte"),
						},
					].map(({ fullscreen, component, isVisible }, index) => (
						<Observer key={index}>
							{() => (
								<S.LayerWrapper
									$fullscreen={fullscreen}
									style={isVisible() ? {} : { pointerEvents: "none", opacity: 0 }}>
									{component}
								</S.LayerWrapper>
							)}
						</Observer>
					))}
				</PromoContainer>
			</S.LayerWrapper>
		</S.Wrapper>
	);
};

export const Main: React.FC = () => {
	return (
		<Layout>
			<Content />
		</Layout>
	);
};
