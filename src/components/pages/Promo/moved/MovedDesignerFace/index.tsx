import { useContext } from "react";
import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/common/hoc/Iteration";

import { Image } from "@components/common/ui/Image";

import { interpolations } from "@core/helpers/iteration.helper";

import * as S from "./styled";

import { context as promoContext } from "../../index";

export interface Props {
	avatarSource: string;
}

export const MovedDesignerFace: React.FC<Props> = ({ avatarSource }) => {
	const promoStore = useContext(promoContext);

	return (
		<Iteration
			iterations={[5, 8]}
			checkForVisible={([iteration5, iteration8]) => iteration5.opened() && !iteration8.started()}>
			{([iteration5]) => (
				<Observer>
					{() => (
						<S.MovedDesignerFace
							style={{
								x: iteration5.interpolations.closing
									.to(interpolations.easing("easeInOutCubic"))
									.to(
										(value) =>
											value * promoStore.transforms.executorAndPhoneExecutor.getPosition().x -
											(promoStore.transforms.executorAndPhoneExecutor.endResizeObserver.getSize().width -
												promoStore.transforms.executorAndPhoneExecutor.startResizeObserver.getSize().width) /
												2
									),
								y: iteration5.interpolations.closing
									.to(interpolations.easing("easeInOutCubic"))
									.to(
										(value) =>
											value * promoStore.transforms.executorAndPhoneExecutor.getPosition().y -
											(promoStore.transforms.executorAndPhoneExecutor.endResizeObserver.getSize().height -
												promoStore.transforms.executorAndPhoneExecutor.startResizeObserver.getSize().height) /
												2
									),
								scaleX: iteration5.interpolations.closing
									.to(interpolations.easing("easeInOutCubic"))
									.to(
										(value) =>
											1 - (1 - 1 / promoStore.transforms.executorAndPhoneExecutor.getScale().x) * (1 - value)
									),
								scaleY: iteration5.interpolations.closing
									.to(interpolations.easing("easeInOutCubic"))
									.to(
										(value) =>
											1 - (1 - 1 / promoStore.transforms.executorAndPhoneExecutor.getScale().y) * (1 - value)
									),
								...promoStore.transforms.executorAndPhoneExecutor.endResizeObserver.getSize(),
								...promoStore.transforms.executorAndPhoneExecutor.getStartOffset(),
							}}>
							<Image src={avatarSource} lazy={false} />
						</S.MovedDesignerFace>
					)}
				</Observer>
			)}
		</Iteration>
	);
};
