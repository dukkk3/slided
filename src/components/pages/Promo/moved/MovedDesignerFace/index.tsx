import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/common/hoc/Iteration";

import { Image } from "@components/common/ui/Image";

import { interpolations } from "@core/helpers/iteration.helper";

import { usePromo } from "../../index";

import * as S from "./styled";

export interface Props {
	avatarSource: string;
}

export const MovedDesignerFace: React.FC<Props> = ({ avatarSource }) => {
	const promo = usePromo();

	return (
		<Iteration
			iterations={[5, 8]}
			checkForVisible={([iteration5, iteration8]) => iteration5.opened() && !iteration8.started()}
			visibilitySwitch={{ unmountWhenInvisible: false }}>
			{([iteration5]) => (
				<div>
					<Observer>
						{() => (
							<S.MovedDesignerFace
								style={{
									x: iteration5.interpolations.closing
										.to(interpolations.easing("easeInOutCubic"))
										.to(
											(value) =>
												value * promo.transforms.executorAndPhoneExecutor.getPosition().x -
												(promo.transforms.executorAndPhoneExecutor.endResizeObserver.getSize().width -
													promo.transforms.executorAndPhoneExecutor.startResizeObserver.getSize().width) /
													2
										),
									y: iteration5.interpolations.closing
										.to(interpolations.easing("easeInOutCubic"))
										.to(
											(value) =>
												value * promo.transforms.executorAndPhoneExecutor.getPosition().y -
												(promo.transforms.executorAndPhoneExecutor.endResizeObserver.getSize().height -
													promo.transforms.executorAndPhoneExecutor.startResizeObserver.getSize().height) /
													2
										),
									scaleX: iteration5.interpolations.closing
										.to(interpolations.easing("easeInOutCubic"))
										.to(
											(value) =>
												1 - (1 - 1 / promo.transforms.executorAndPhoneExecutor.getScale().x) * (1 - value)
										),
									scaleY: iteration5.interpolations.closing
										.to(interpolations.easing("easeInOutCubic"))
										.to(
											(value) =>
												1 - (1 - 1 / promo.transforms.executorAndPhoneExecutor.getScale().y) * (1 - value)
										),
									...promo.transforms.executorAndPhoneExecutor.endResizeObserver.getSize(),
									...promo.transforms.executorAndPhoneExecutor.getStartOffset(),
								}}>
								<Image src={avatarSource} lazy={false} />
							</S.MovedDesignerFace>
						)}
					</Observer>
				</div>
			)}
		</Iteration>
	);
};
