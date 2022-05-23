import { useCallback, useEffect } from "react";
import { Layout } from "@components/containers/layout/Layout";
import { PromoContainer } from "@components/containers/layout/PromoContainer";

import { TableBackground } from "@components/containers/sections/TableBackground";
import { PromoBannerLayer } from "@components/containers/sections/PromoBannerLayer";
import { AssistantLayer } from "@components/containers/sections/AssistantLayer";

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

		return () => {
			document.removeEventListener("keydown", handleDocumentKeydown);
		};
	}, [handleDocumentKeydown]);

	return (
		<S.Wrapper>
			<S.TableBackgroundWrapper>
				<TableBackground />
			</S.TableBackgroundWrapper>
			<S.LayerWrapper>
				<PromoContainer>
					{[<PromoBannerLayer />, <AssistantLayer />].map((content, index) => (
						<S.LayerWrapper key={index}>{content}</S.LayerWrapper>
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
