import { useContext } from "react";
import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/common/hoc/Iteration";

import { Image } from "@components/common/ui/Image";

import { interpolations } from "@core/helpers/iteration.helper";

import * as S from "./styled";

import { context as promoContext } from "../../index";

export interface Props {
	templateSource: string;
}

export const MovedTemplate: React.FC<Props> = ({ templateSource }) => {
	const promoStore = useContext(promoContext);

	return (
		<Iteration
			iterations={9}
			checkForVisible={([iteration9]) => iteration9.visible("closing")}
			visibilitySwitch={{ unmountWhenInvisible: false }}>
			{([iteration9]) => (
				<div>
					<Observer>
						{() => (
							<S.MovedTemplate
								style={{
									...promoStore.transforms.phoneTemplateAndGridTemplate.startResizeObserver.getSize(),
									...promoStore.transforms.phoneTemplateAndGridTemplate.getStartOffset(),
									x: iteration9.interpolations.closing
										.to(interpolations.easing("easeInOutCubic"))
										.to(
											(value) => promoStore.transforms.phoneTemplateAndGridTemplate.getPosition().x * value
										),
									y: iteration9.interpolations.closing
										.to(interpolations.easing("easeInOutCubic"))
										.to(
											(value) => promoStore.transforms.phoneTemplateAndGridTemplate.getPosition().y * value
										),
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
