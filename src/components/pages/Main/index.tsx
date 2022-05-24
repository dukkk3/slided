import { useCallback, useEffect } from "react";
import { Layout } from "@components/containers/layout/Layout";
import { PromoContainer } from "@components/containers/layout/PromoContainer";

import { TableBackground } from "@components/containers/sections/TableBackground";
import { PromoBannerLayer } from "@components/containers/sections/PromoBannerLayer";
import { AssistantLayer } from "@components/containers/sections/AssistantLayer";
import { PhoneLayer } from "@components/containers/sections/PhoneLayer";

import { useIterationControls } from "@core/hooks";

import * as S from "./styled";

const Content: React.FC = () => {
	const iterationControls = useIterationControls();

	const handleDocumentKeydown = useCallback(
		(event: KeyboardEvent) => {
			switch (event.key) {
				case "ArrowDown":
					return iterationControls.animate(iterationControls.getTarget() + 1);
				case "ArrowUp":
					return iterationControls.animate(iterationControls.getTarget() - 1);
			}
		},
		[iterationControls]
	);

	useEffect(() => {
		document.addEventListener("keydown", handleDocumentKeydown);
		iterationControls.set(4);

		return () => {
			document.removeEventListener("keydown", handleDocumentKeydown);
		};
	}, [handleDocumentKeydown, iterationControls]);

	return (
		<S.Wrapper>
			<S.TableBackgroundWrapper>
				<TableBackground />
			</S.TableBackgroundWrapper>
			<S.LayerWrapper>
				<PromoContainer>
					{[
						{ fullscreen: true, component: <PromoBannerLayer /> },
						{ fullscreen: true, component: <PhoneLayer /> },
						{ fullscreen: false, component: <AssistantLayer /> },
					].map(({ fullscreen, component }, index) => (
						<S.LayerWrapper key={index} $fullscreen={fullscreen}>
							{component}
						</S.LayerWrapper>
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
