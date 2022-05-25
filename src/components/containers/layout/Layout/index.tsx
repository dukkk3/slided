import React, { useCallback, useEffect } from "react";
import { Observer } from "mobx-react-lite";
import { reaction } from "mobx";

import { Header } from "@components/containers/layout/Header";

import { ScrollControls } from "@components/common/hoc/ScrollControls";
import { IterationControls } from "@components/common/hoc/IterationControls";

import { useGlobalStore, useResizeObserver } from "@core/hooks";

import * as S from "./styled";

export interface Props extends React.PropsWithChildren<{}> {}

export const Layout: React.FC<Props> = ({ children }) => {
	const promoStore = useGlobalStore((store) => store.layout.promo);
	const headerResizeObserver = useResizeObserver({ calculateSizeWithPaddings: true });

	const updateCSSProperties = useCallback(() => {
		const { height: headerHeight, width: headerWidth } = headerResizeObserver.getSize();

		document.body.style.setProperty("--header-height", `${headerHeight}px`);
		document.body.style.setProperty("--header-width", `${headerWidth}px`);
	}, [headerResizeObserver]);

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
			<S.HeaderWrapper ref={headerResizeObserver.ref}>
				<Header />
			</S.HeaderWrapper>
			<main>
				<Observer>
					{() => (
						// <IterationControls iterations={10}>{children}</IterationControls>
						<ScrollControls pages={6} enabled={promoStore.interactiveEnabled()}>
							{children}
						</ScrollControls>
					)}
				</Observer>
			</main>
		</S.Layout>
	);
};
