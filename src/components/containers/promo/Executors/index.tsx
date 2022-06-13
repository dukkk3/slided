import { useEffect, useRef } from "react";
import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/common/hoc/Iteration";
import { VisibilitySwitch } from "@components/common/hoc/VisibilitySwitch";

import { UserCard, Props as UserCardProps } from "@components/common/ordinary/UserCard";

import {
	useBreakpoint,
	useLocalStore,
	useResizeObserver,
	useTransformDifference,
} from "@core/hooks";
import { inlineSwitch } from "@core/utils";

import { getRasterImageByName } from "@assets/images";

import * as S from "./styled";

export interface Props extends React.ComponentProps<"div"> {
	faceContainerRef?: React.ForwardedRef<any>;
	phoneCardsContainerRef?: React.RefObject<any>;
}

export const Executors: React.FC<Props> = ({
	phoneCardsContainerRef,
	faceContainerRef,
	...rest
}) => {
	const breakpoint = useBreakpoint();
	const phoneCardsTransformDifference = useTransformDifference({ startRef: phoneCardsContainerRef });

	const localStore = useLocalStore({
		get mobile() {
			return breakpoint.range("mobile", "tablet");
		},
	});

	const mobileHiddenExecutor = (
		<VisibilitySwitch visible={false}>
			<S.UserCardGroup
				style={{
					top: 0,
					left: 0,
					position: "absolute",
				}}>
				<UserCard {...TARGET_USER.data} avatarRef={faceContainerRef} />
			</S.UserCardGroup>
		</VisibilitySwitch>
	);

	return (
		<Observer>
			{() =>
				localStore.mobile ? (
					<S.Executors
						{...(rest as any)}
						style={{
							...phoneCardsTransformDifference.startResizeObserver.getSize(),
							...phoneCardsTransformDifference.getStartOffset(),
						}}>
						<S.ExecutorsContent>
							{mobileHiddenExecutor}
							<Iteration iterations={5}>
								{([iteration5], interpolations) => (
									<div>
										<Observer>
											{() => (
												<>
													{USERS_MOBILE.map(({ data }, index) => (
														<S.UserCardGroup key={index}>
															<S.UserCardWrapper
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
																	opacity: inlineSwitch(
																		iteration5.currentState() === "opening",
																		iteration5.interpolations.opening
																			.to(
																				interpolations.range(
																					index / USERS_MOBILE.length,
																					(index + 1) / USERS_MOBILE.length
																				)
																			)
																			.to(interpolations.easing("easeInOutCubic"))
																			.to((value) => (1 - (1 / USERS_MOBILE.length) * index) * value),
																		iteration5.interpolations.closing
																			.to(interpolations.easing("easeInOutCubic"))
																			.to(interpolations.invert)
																			.to((value) => (1 - (1 / USERS_MOBILE.length) * index) * value)
																	),
																}}>
																<UserCard
																	{...data}
																	avatarVisibleInterpolation={
																		index === TARGET_INDEX
																			? iteration5.interpolations.closing
																					.to(interpolations.easing("easeInOutQuart"))
																					.to(interpolations.step(0.001))
																					.to(interpolations.invert)
																			: undefined
																	}
																/>
															</S.UserCardWrapper>
														</S.UserCardGroup>
													))}
												</>
											)}
										</Observer>
									</div>
								)}
							</Iteration>
						</S.ExecutorsContent>
					</S.Executors>
				) : (
					<S.Executors {...(rest as any)}>
						<VisibilitySwitch visible={false}>
							<S.UserCardGroup
								style={{
									top: `${normalize(TARGET_USER.position.y) * 100}%`,
									left: `${normalize(TARGET_USER.position.x) * 100}%`,
									transform: `translate3d(-50%, -50%, 0)`,
								}}>
								<UserCard {...TARGET_USER.data} avatarRef={faceContainerRef} />
							</S.UserCardGroup>
						</VisibilitySwitch>
						<Iteration iterations={5}>
							{([iteration5], interpolations) => (
								<div>
									<Observer>
										{() => (
											<>
												{USERS.map(({ position, data, inQueueIndex }, index) => (
													<S.UserCardGroup
														key={index}
														style={{
															top: `${(position.y / 2 + 0.5) * 100}%`,
															left: `${(position.x / 2 + 0.5) * 100}%`,
															transform: `translate3d(-50%, -50%, 0)`,
														}}>
														<S.UserCardWrapper
															style={{
																opacity: inlineSwitch(
																	iteration5.currentState() === "opening",
																	iteration5.interpolations.opening
																		.to(interpolations.range(0, 0.5))
																		.to(interpolations.easing("easeInOutCubic")),
																	iteration5.interpolations.closing
																		.to(interpolations.range(0, 0.5))
																		.to(interpolations.easing("easeInOutCubic"))
																		.to(interpolations.invert)
																),
																scale: inlineSwitch(
																	iteration5.currentState() === "opening",
																	iteration5.interpolations.opening
																		.to(
																			interpolations.range(
																				inQueueIndex / USERS.length,
																				(inQueueIndex + 1) / USERS.length
																			)
																		)
																		.to(interpolations.easing("easeInOutCubic")),
																	iteration5.interpolations.closing
																		.to(interpolations.invert)
																		.to(interpolations.easing("easeInOutCubic"))
																),
															}}>
															<UserCard
																{...data}
																avatarVisibleInterpolation={
																	index === TARGET_INDEX
																		? iteration5.interpolations.closing
																				.to(interpolations.easing("easeInOutQuart"))
																				.to(interpolations.step(0.001))
																				.to(interpolations.invert)
																		: undefined
																}
															/>
														</S.UserCardWrapper>
													</S.UserCardGroup>
												))}
											</>
										)}
									</Observer>
								</div>
							)}
						</Iteration>
					</S.Executors>
				)
			}
		</Observer>
	);
};

const USERS: { inQueueIndex: number; data: UserCardProps; position: { x: number; y: number } }[] = [
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
const TARGET_USER = USERS[TARGET_INDEX];

function normalize(x: number) {
	return x / 2 + 0.5;
}