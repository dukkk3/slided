import React, { useCallback, useEffect } from "react";
import { reaction } from "mobx";

import { Header } from "@components/containers/layout/Header";

import { ScrollControls } from "@components/common/hoc/ScrollControls";

import { useResizeObserver } from "@core/hooks";

import * as S from "./styled";

export interface Props extends React.PropsWithChildren<{}> {
	scrollEnabled?: boolean;
}

export const Layout: React.FC<Props> = ({ children, scrollEnabled = true }) => {
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
				<ScrollControls enabled={scrollEnabled}>{children}</ScrollControls>
			</main>
		</S.Layout>
	);
};
