import { memo } from "react";
import { Interpolation } from "react-spring";
import isEqual from "react-fast-compare";

import { VisibilitySwitch } from "@components/common/hoc/VisibilitySwitch";

import { Image } from "@components/common/ui/Image";

import { useResizeObserver } from "@core/hooks";
import { mergeRefs } from "@core/utils";

import * as S from "./styled";

interface Template {
	source: string;
	visibleLayerSource?: string;
}

export interface Props {
	type: "opening" | "closing";
	templates: Template[];
	hiddenTemplateRef?: React.ForwardedRef<any>;
	shiftedHiddenTemplateRef?: React.ForwardedRef<any>;
	hideCardInterpolation: Interpolation<number, number>;
	showHiddenLayerInterpolation: Interpolation<number, number>;
	hideScanLineInterpolation: Interpolation<number, number>;
	shakeCardsInterpolation: Interpolation<number, number>;
}

export const ReadyTemplatesCards: React.FC<Props> = memo(
	({
		type,
		templates,
		hiddenTemplateRef,
		hideCardInterpolation,
		shiftedHiddenTemplateRef,
		showHiddenLayerInterpolation,
		hideScanLineInterpolation,
		shakeCardsInterpolation,
	}) => {
		const cardResizeObserver = useResizeObserver();

		return (
			<S.ReadyTemplatesCards>
				<VisibilitySwitch visible={false}>
					<S.CardWrapper $overlay>
						<S.Card>
							<S.CardImage ref={mergeRefs(hiddenTemplateRef, cardResizeObserver.ref)} />
						</S.Card>
					</S.CardWrapper>
				</VisibilitySwitch>
				<VisibilitySwitch visible={false}>
					<S.CardWrapper $overlay>
						<S.Card style={{ y: getCardTranslate(1, 0) }}>
							<S.CardImage ref={shiftedHiddenTemplateRef} />
						</S.Card>
					</S.CardWrapper>
				</VisibilitySwitch>
				{templates.map((template, index) => (
					<S.CardWrapper key={index} style={{ zIndex: templates.length - index }}>
						<S.Card
							style={{
								y: shakeCardsInterpolation.to((value) => getCardTranslate(value, index)),
								scale: shakeCardsInterpolation.to((value) => 1 - 0.1 * index * value),
								opacity:
									index === 0 && type === "closing"
										? hideCardInterpolation
										: shakeCardsInterpolation.to((value) => 1 - (index / templates.length) * value),
							}}>
							<S.CardImage style={{ height: cardResizeObserver.getSize().height }}>
								<Image src={template.source} />
							</S.CardImage>
							{template.visibleLayerSource && (
								<>
									<S.OverlayCardImage
										style={{ height: showHiddenLayerInterpolation.to((value) => `${(1 - value) * 100}%`) }}>
										<S.CardImage style={{ height: cardResizeObserver.getSize().height }}>
											<Image src={template.visibleLayerSource} />
										</S.CardImage>
									</S.OverlayCardImage>
									<S.Scan
										style={{
											opacity: hideScanLineInterpolation,
											y: showHiddenLayerInterpolation.to(
												(value) => (1 - value) * cardResizeObserver.getSize().height
											),
										}}
									/>
								</>
							)}
						</S.Card>
					</S.CardWrapper>
				))}
			</S.ReadyTemplatesCards>
		);
	},
	(
		{ shakeCardsInterpolation: a, showHiddenLayerInterpolation: _a, ...prevProps },
		{ shakeCardsInterpolation: b, showHiddenLayerInterpolation: _b, ...nextProps }
	) => isEqual(prevProps, nextProps)
);

function getCardTranslate(value: number, index: number) {
	return index === 0 ? `${20 * value}%` : `-${index * 117.5 * value - 20 * value}%`;
}