import { useContext } from "react";
import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/common/hoc/Iteration";

import { VisibilitySwitch } from "@components/common/ui/VisibilitySwitch";

import { useBreakpoint } from "@core/hooks/useBreakpoint";
import { interpolations } from "@core/helpers/iteration.helper";
import { Sequence } from "@core/classes/Sequence";
import { createArray } from "@core/utils/common.utils";

import { PresentationSequence } from "./PresentationSequence";
import { context as promoContext } from "../../index";

import * as S from "./styled";

export interface Props {
	templateSource: string;
}

export const Presentation: React.FC<Props> = ({ templateSource }) => {
	const promoStore = useContext(promoContext);
	const breakpoint = useBreakpoint();

	return (
		<Iteration
			iterations={[7, 8]}
			checkForVisible={([iteration7, iteration8]) => iteration7.started() && !iteration8.opened()}
			visibilitySwitch={{ unmountWhenInvisible: false }}>
			{([iteration7, iteration8]) => (
				<div data-iteration-name='Presentation'>
					<VisibilitySwitch visible={false} unmountWhenInvisible={false}>
						<S.EndContainer ref={promoStore.transforms.bigTemplateAndPhoneTemplate.startRef} />
					</VisibilitySwitch>
					<S.EndContainer style={{ perspective: `${PERSPECTIVE}rem` }}>
						<Observer>
							{() => (
								<S.Card
									className='safari-border-radius-overflow-bugfix'
									style={{
										opacity: iteration8.started()
											? iteration8.interpolations.opening
													.to(interpolations.step(1))
													.to(interpolations.easing("easeInOutCubic"))
													.to(interpolations.invert)
											: iteration7.interpolations.opening
													.to(interpolations.range(0, 0.5))
													.to(interpolations.easing("easeInOutCubic")),
										z: iteration7.interpolations.opening
											.to(interpolations.easing("easeInOutCubic"))
											.to(interpolations.invert)
											.to((value) => `${PERSPECTIVE * 0.4 * value}rem`),
										x: iteration8.interpolations.opening
											.to(interpolations.easing("easeInOutCubic"))
											.to(
												(value) => promoStore.transforms.bigTemplateAndPhoneTemplate.getPosition().x * value
											),
										y: iteration8.interpolations.opening
											.to(interpolations.easing("easeInOutCubic"))
											.to(
												(value) => promoStore.transforms.bigTemplateAndPhoneTemplate.getPosition().y * value
											),
										width: iteration8.interpolations.opening
											.to(interpolations.easing("easeInOutCubic"))
											.to(
												(value) =>
													1 - (1 - promoStore.transforms.bigTemplateAndPhoneTemplate.getScale().x) * value
											)
											.to((value) => `${value * 100}%`),
										height: iteration8.interpolations.opening
											.to(interpolations.easing("easeInOutCubic"))
											.to(
												(value) =>
													1 - (1 - promoStore.transforms.bigTemplateAndPhoneTemplate.getScale().y) * value
											)
											.to((value) => `${value * 100}%`),
										background: `url(${templateSource}) center center / cover`,
										transformOrigin: "left top",
									}}>
									<S.CardImageGroup
										$zoom={IMAGE_ZOOM}
										style={{
											scale: iteration7.interpolations.opening
												.to(interpolations.easing("easeInOutCubic"))
												.to((value) => 1 + (1 / IMAGE_ZOOM - 1) * value),
											opacity: iteration7.interpolations.closing
												.to(breakpoint.mobile() ? interpolations.range(0.95, 1) : interpolations.step(0.999))
												.to(interpolations.easing("easeInOutCubic"))
												.to(interpolations.invert),
										}}>
										<PresentationSequence
											sequence={breakpoint.mobile() ? SEQUENCE_MOBILE : SEQUENCE_DESKTOP}
										/>
									</S.CardImageGroup>
								</S.Card>
							)}
						</Observer>
					</S.EndContainer>
				</div>
			)}
		</Iteration>
	);
};

const PERSPECTIVE = 1;
const IMAGE_ZOOM = 2;

export const presentationFramesDesktop = createArray(125).map(
	(_, index) =>
		`https://ik.imagekit.io/64nah4dsw/slided/present_sequence/${String(index + 1).padStart(
			3,
			"0"
		)}.jpg`
);

export const presentationFramesMobile = createArray(125).map(
	(_, index) =>
		`https://ik.imagekit.io/64nah4dsw/slided/present_sequence_mobile/${String(index + 1).padStart(
			3,
			"0"
		)}.jpg`
);

const SEQUENCE_DESKTOP = new Sequence(
	presentationFramesDesktop.length,
	(index) => presentationFramesDesktop[index]
);

const SEQUENCE_MOBILE = new Sequence(
	presentationFramesMobile.length,
	(index) => presentationFramesMobile[index]
);
