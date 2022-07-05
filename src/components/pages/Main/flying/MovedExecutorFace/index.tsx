import { useContext } from "react";
import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/common/hoc/Iteration";

import { Image } from "@components/common/ui/Image";

import { interpolations } from "@core/helpers/iteration.helper";

import * as S from "./styled";

import { transformsContext } from "../../index";

export interface Props {
	avatarSource: string;
}

export const MovedExecutorFace: React.FC<Props> = ({ avatarSource }) => {
	const transforms = useContext(transformsContext);

	return (
		<Iteration
			iterations={[5, 8]}
			checkForVisible={([iteration5, iteration8]) => iteration5.opened() && !iteration8.started()}>
			{([iteration5]) => (
				<div>
					<Observer>
						{() => (
							<S.MovedExecutorFace
								style={{
									x: iteration5.interpolations.closing
										.to(interpolations.easing("easeInOutCubic"))
										.to(
											(value) =>
												value * transforms.executorAndPhoneExecutor.getPosition().x -
												(transforms.executorAndPhoneExecutor.endResizeObserver.getSize().width -
													transforms.executorAndPhoneExecutor.startResizeObserver.getSize().width) /
													2
										),
									y: iteration5.interpolations.closing
										.to(interpolations.easing("easeInOutCubic"))
										.to(
											(value) =>
												value * transforms.executorAndPhoneExecutor.getPosition().y -
												(transforms.executorAndPhoneExecutor.endResizeObserver.getSize().height -
													transforms.executorAndPhoneExecutor.startResizeObserver.getSize().height) /
													2
										),
									scaleX: iteration5.interpolations.closing
										.to(interpolations.easing("easeInOutCubic"))
										.to(
											(value) => 1 - (1 - 1 / transforms.executorAndPhoneExecutor.getScale().x) * (1 - value)
										),
									scaleY: iteration5.interpolations.closing
										.to(interpolations.easing("easeInOutCubic"))
										.to(
											(value) => 1 - (1 - 1 / transforms.executorAndPhoneExecutor.getScale().y) * (1 - value)
										),
									...transforms.executorAndPhoneExecutor.endResizeObserver.getSize(),
									...transforms.executorAndPhoneExecutor.getStartOffset(),
								}}>
								<Image src={avatarSource} lazy={false} />
							</S.MovedExecutorFace>
						)}
					</Observer>
				</div>
			)}
		</Iteration>
	);
};
