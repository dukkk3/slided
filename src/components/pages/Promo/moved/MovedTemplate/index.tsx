import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/pages/Promo/helpers/Iteration";

import { Image } from "@components/common/ui/Image";

import { interpolations } from "@core/helpers/iteration.helper";

import { usePromo } from "../../index";

import * as S from "./styled";

export interface Props {
	templateSource: string;
}

export const MovedTemplate: React.FC<Props> = ({ templateSource }) => {
	const promo = usePromo();

	return (
		<Iteration iterations={9} checkForVisible={([iteration9]) => iteration9.visible("closing")}>
			{([iteration9]) => (
				<div>
					<Observer>
						{() => (
							<S.MovedTemplate
								style={{
									...promo.transforms.phoneTemplateAndGridTemplate.startResizeObserver.getSize(),
									...promo.transforms.phoneTemplateAndGridTemplate.getStartOffset(),
									x: iteration9.interpolations.closing
										.to(interpolations.easing("easeInOutCubic"))
										.to((value) => promo.transforms.phoneTemplateAndGridTemplate.getPosition().x * value),
									y: iteration9.interpolations.closing
										.to(interpolations.easing("easeInOutCubic"))
										.to((value) => promo.transforms.phoneTemplateAndGridTemplate.getPosition().y * value),
									opacity: iteration9.interpolations.closing
										.to(interpolations.step(1))
										.to(interpolations.easing("easeInOutCubic"))
										.to(interpolations.invert),
								}}>
								<Image src={templateSource} lazy={false} />
							</S.MovedTemplate>
						)}
					</Observer>
				</div>
			)}
		</Iteration>
	);
};
