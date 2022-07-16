import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/pages/Promo/helpers/Iteration";

import { VisibilitySwitch } from "@components/common/ui/VisibilitySwitch";

import { useBreakpoint } from "@core/hooks/useBreakpoint";
import { interpolations } from "@core/helpers/iteration.helper";

import { getRasterImageByName } from "@assets/images";

import { ProfileCard, Props as ProfileCardProps } from "./ProfileCard";

import { PromoContainer } from "../../shared/PromoContainer";

import { usePromo } from "../../index";

import * as S from "./styled";

export interface Props {
	faceContainerRef: React.Ref<any>;
}

export const Designers: React.FC = () => {
	const promo = usePromo();
	const breakpoint = useBreakpoint();

	return (
		<Observer>
			{() =>
				breakpoint.mobile() ? (
					<DesignersMobile faceContainerRef={promo.transforms.executorAndPhoneExecutor.startRef} />
				) : (
					<DesignersDesktop faceContainerRef={promo.transforms.executorAndPhoneExecutor.startRef} />
				)
			}
		</Observer>
	);
};

const DesignersMobile: React.FC<Props> = ({ faceContainerRef }) => {
	const promo = usePromo();

	return (
		<Iteration iterations={5}>
			{([iteration5]) => (
				<div data-iteration-name='Designers'>
					<Observer>
						{() => (
							<S.Designers
								style={{
									...promo.resizeObservers.phoneCardsContainer.getSize(),
									...promo.resizeObservers.phoneCardsContainer.getOffset(),
								}}>
								<S.Content>
									<VisibilitySwitch visible={false}>
										<S.ProfileCardGroup
											style={{
												top: 0,
												left: 0,
												position: "absolute",
											}}>
											<ProfileCard {...TARGET_USER.data} avatarRef={faceContainerRef} />
										</S.ProfileCardGroup>
									</VisibilitySwitch>
									<Observer>
										{() => (
											<VisibilitySwitch visible={iteration5.visible()}>
												{USERS_MOBILE.map(({ data }, index) => (
													<S.ProfileCardGroup key={index}>
														<S.ProfileCardWrapper
															style={{
																y: iteration5.interpolations.opening
																	.to(
																		interpolations.range(
																			index / USERS_MOBILE.length,
																			(index + 1) / USERS_MOBILE.length
																		)
																	)
																	.to(interpolations.easing("easeInOutCubic"))
																	.to(interpolations.invert)
																	.to((value) => `${-20 * value}%`),
																opacity:
																	iteration5.currentState() === "opening"
																		? iteration5.interpolations.opening
																				.to(
																					interpolations.range(
																						index / USERS_MOBILE.length,
																						(index + 1) / USERS_MOBILE.length
																					)
																				)
																				.to(interpolations.easing("easeInOutCubic"))
																				.to((value) => (1 - (1 / USERS_MOBILE.length) * index) * value)
																		: iteration5.interpolations.closing
																				.to(interpolations.easing("easeInOutCubic"))
																				.to(interpolations.invert)
																				.to((value) => (1 - (1 / USERS_MOBILE.length) * index) * value),
															}}>
															<ProfileCard
																{...data}
																avatarVisibleInterpolation={
																	index === TARGET_INDEX
																		? iteration5.interpolations.closing
																				.to(interpolations.step(0.001))
																				.to(interpolations.easing("easeInOutQuart"))
																				.to(interpolations.invert)
																		: undefined
																}
															/>
														</S.ProfileCardWrapper>
													</S.ProfileCardGroup>
												))}
											</VisibilitySwitch>
										)}
									</Observer>
								</S.Content>
							</S.Designers>
						)}
					</Observer>
				</div>
			)}
		</Iteration>
	);
};

const DesignersDesktop: React.FC<Props> = ({ faceContainerRef }) => {
	return (
		<Iteration iterations={5}>
			{([iteration5]) => (
				<PromoContainer
					data-iteration-name='Designers'
					style={{ top: 0, left: 0, position: "absolute", width: "100%" }}>
					<S.Designers>
						<VisibilitySwitch visible={false}>
							<S.ProfileCardGroup
								style={{
									top: `${normalize(TARGET_USER.position.y) * 100}%`,
									left: `${normalize(TARGET_USER.position.x) * 100}%`,
									transform: `translate3d(-50%, -50%, 0)`,
								}}>
								<ProfileCard {...TARGET_USER.data} avatarRef={faceContainerRef} />
							</S.ProfileCardGroup>
						</VisibilitySwitch>
						<Observer>
							{() => (
								<VisibilitySwitch visible={iteration5.visible()}>
									<div>
										{USERS.map(({ position, data, inQueueIndex }, index) => (
											<S.ProfileCardGroup
												key={index}
												style={{
													top: `${(position.y / 2 + 0.5) * 100}%`,
													left: `${(position.x / 2 + 0.5) * 100}%`,
													transform: `translate3d(-50%, -50%, 0)`,
												}}>
												<S.ProfileCardWrapper
													style={{
														opacity:
															iteration5.currentState() === "opening"
																? iteration5.interpolations.opening
																		.to(interpolations.range(0, 0.5))
																		.to(interpolations.easing("easeInOutCubic"))
																: iteration5.interpolations.closing
																		.to(interpolations.range(0, 0.5))
																		.to(interpolations.easing("easeInOutCubic"))
																		.to(interpolations.invert),
														scale:
															iteration5.currentState() === "opening"
																? iteration5.interpolations.opening
																		.to(
																			interpolations.range(
																				inQueueIndex / USERS.length,
																				(inQueueIndex + 1) / USERS.length
																			)
																		)
																		.to(interpolations.easing("easeInOutCubic"))
																: iteration5.interpolations.closing
																		.to(interpolations.invert)
																		.to(interpolations.easing("easeInOutCubic")),
													}}>
													<ProfileCard
														{...data}
														avatarVisibleInterpolation={
															index === TARGET_INDEX
																? iteration5.interpolations.closing
																		.to(interpolations.step(0.001))
																		.to(interpolations.easing("easeInOutQuart"))
																		.to(interpolations.invert)
																: undefined
														}
													/>
												</S.ProfileCardWrapper>
											</S.ProfileCardGroup>
										))}
									</div>
								</VisibilitySwitch>
							)}
						</Observer>
					</S.Designers>
				</PromoContainer>
			)}
		</Iteration>
	);
};

const USERS: {
	inQueueIndex: number;
	data: ProfileCardProps;
	position: { x: number; y: number };
}[] = [
	{
		inQueueIndex: 0,
		data: { avatarSource: getRasterImageByName("Man1"), name: "Mark", rating: 4.5 },
		position: { x: -0.7, y: 0.1 },
	},
	{
		inQueueIndex: 5,
		data: { avatarSource: getRasterImageByName("Woman1"), name: "Limba", size: "s" },
		position: { x: -0.6, y: 0.7 },
	},
	{
		inQueueIndex: 2,
		data: { avatarSource: getRasterImageByName("Man2"), name: "Piers", size: "s" },
		position: { x: -0.5, y: -0.4 },
	},
	{
		inQueueIndex: 4,
		data: { avatarSource: getRasterImageByName("Man3"), name: "David", size: "s" },
		position: { x: -0.8, y: -0.65 },
	},
	//
	{
		inQueueIndex: 6,
		data: { avatarSource: getRasterImageByName("Man4"), name: "Alex", rating: 4.7 },
		position: { x: 0.6, y: 0.4 },
	},
	{
		inQueueIndex: 1,
		data: { avatarSource: getRasterImageByName("Woman3"), name: "Roza", size: "s" },
		position: { x: 0.8, y: -0.1 },
	},
	{
		inQueueIndex: 3,
		data: { avatarSource: getRasterImageByName("Woman2"), name: "Margo", rating: 4.9 },
		position: { x: 0.65, y: -0.7 },
	},
];
const USERS_MOBILE = USERS.slice(0, Math.min(4, USERS.length));

const TARGET_INDEX = 0;
export const TARGET_USER = USERS[TARGET_INDEX];

function normalize(x: number) {
	return x / 2 + 0.5;
}
