import { useContext } from "react";
import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/common/hoc/Iteration";

import { Image } from "@components/common/ui/Image";

import { interpolations } from "@core/helpers/iteration.helper";

import * as S from "./styled";

import { transformsContext } from "../../index";

export interface Props {
	templateSource: string;
}

export const MovedGridTemplate: React.FC<Props> = ({ templateSource }) => {
	const transforms = useContext(transformsContext);

	return (
		<Iteration iterations={9} checkForVisible={([iteration9]) => iteration9.visible("closing")}>
			{([iteration9]) => (
				<div>
					<Observer>
						{() => (
							<S.MovedGridTemplate
								style={{
									...transforms.phoneTemplateAndGridTemplate.startResizeObserver.getSize(),
									top: transforms.phoneTemplateAndGridTemplate.getStartOffset().top,
									left: transforms.phoneTemplateAndGridTemplate.getStartOffset().left,
									x: iteration9.interpolations.closing
										.to(interpolations.easing("easeInOutCubic"))
										.to((value) => transforms.phoneTemplateAndGridTemplate.getPosition().x * value),
									y: iteration9.interpolations.closing
										.to(interpolations.easing("easeInOutCubic"))
										.to((value) => transforms.phoneTemplateAndGridTemplate.getPosition().y * value),
									opacity: iteration9.interpolations.closing
										.to(interpolations.easing("easeInOutCubic"))
										.to(interpolations.step(1))
										.to(interpolations.invert),
								}}>
								<Image src={templateSource} lazy={false} />
							</S.MovedGridTemplate>
						)}
					</Observer>
				</div>
			)}
		</Iteration>
	);
};
