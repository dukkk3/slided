import React, { useCallback, useEffect, useRef } from "react";
import { reaction } from "mobx";

import { useResizeObserver } from "@core/hooks/useResizeObserver";

import { Header, Props as HeaderProps } from "./Header";

import * as S from "./styled";

export interface Props extends React.PropsWithChildren<{}> {
	header?: HeaderProps;
}

export const Layout: React.FC<Props> = ({ children, header }) => {
	const layoutRef = useRef<HTMLDivElement>(null);
	const headerResizeObserver = useResizeObserver({
		calculateSizeWithPaddings: true,
		debounce: 100,
		withOffset: false,
	});

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

	useEffect(() => {
		updateCSSProperties();
	}, [updateCSSProperties]);

	return (
		<S.Layout ref={layoutRef}>
			<S.HeaderWrapper ref={headerResizeObserver.ref}>
				<Header {...header} />
			</S.HeaderWrapper>
			<div>{children}</div>
		</S.Layout>
	);
};
