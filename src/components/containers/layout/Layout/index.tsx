import React, { useCallback, useEffect } from "react";
import { reaction } from "mobx";

import { Header } from "@components/containers/layout/Header";

import { IterationControls } from "@components/common/hoc/IterationControls";

import { useResizeObserver } from "@core/hooks";

import * as S from "./styled";

export interface Props extends React.PropsWithChildren<{}> {}

export const Layout: React.FC<Props> = ({ children }) => {
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
				<IterationControls iterations={10}>{children}</IterationControls>
			</main>
		</S.Layout>
	);
};
