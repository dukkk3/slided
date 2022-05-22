import { Observer } from "mobx-react-lite";
import { useTransform } from "framer-motion";

import { Layout } from "@components/containers/layout/Layout";
import { PromoContainer } from "@components/containers/layout/PromoContainer";

import { TableBackground } from "@components/containers/sections/TableBackground";
import { PromoBannerLayer } from "@components/containers/sections/PromoBannerLayer";
import { AssistantLayer } from "@components/containers/sections/AssistantLayer";

import { useGlobalStore, useScroll } from "@core/hooks";

import * as S from "./styled";

const Content: React.FC = () => {
	const scroll = useScroll();
	console.log(scroll);
	const wrapperYTranslate = useTransform(
		scroll.animated.progress,
		(value) => value * (scroll.store.pages - 1) * scroll.store.containerHeight
	);

	return (
		<S.Wrapper
			style={{
				y: wrapperYTranslate,
			}}>
			<S.TableBackgroundWrapper>
				<TableBackground />
			</S.TableBackgroundWrapper>
			<S.LayerWrapper>
				<PromoContainer>
					{[
						<AssistantLayer />,
						// <PromoBannerLayer />
					].map((content, index) => (
						<S.LayerWrapper key={index}>{content}</S.LayerWrapper>
					))}
				</PromoContainer>
			</S.LayerWrapper>
		</S.Wrapper>
	);
};

export const Main: React.FC = () => {
	const promoStore = useGlobalStore((store) => store.layout.promo);

	return (
		<Observer>
			{() => (
				<Layout
					scrollEnabled={
						// promoStore.promoBannerOpeningAnimationEnded &&
						promoStore.sequenceOpeningAnimationEnded
					}>
					<Content />
					<S.Content />
				</Layout>
			)}
		</Observer>
	);
};
