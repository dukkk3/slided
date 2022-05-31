import { useEffect, useRef } from "react";
import { Observer } from "mobx-react-lite";
import { reaction } from "mobx";

import { UserCard, Props as UserCardProps } from "@components/common/ordinary/UserCard";

import { Image } from "@components/common/ui/Image";

import {
	useGlobalStore,
	useIteration,
	useIterationControls,
	useLocalStore,
	useResizeObserver,
} from "@core/hooks";
import { calculateCoord, calculateElementOffset, calculateScale } from "@core/utils";

import * as S from "./styled";

export const UsersLayer: React.FC = () => {
	const targetAvatarRef = useRef<HTMLDivElement>(null);
	const promoStore = useGlobalStore((store) => store.layout.promo);
	const localStore = useLocalStore({ neededAvatarProps: { x: 0, y: 0, scaleX: 1, scaleY: 1 } });
	const targetCardResizeObserver = useResizeObserver();
	const targetAvatarResizeObserver = useResizeObserver();
	const iterationControls = useIterationControls();
	const iteration5 = useIteration(5);

	useEffect(
		() =>
			reaction(
				() =>
					[
						promoStore.executorFaceStyles,
						targetAvatarResizeObserver.getSize(),
						targetAvatarResizeObserver.getPosition(),
					] as const,
				([executorFaceStyles, size]) => {
					const offset = calculateElementOffset(targetAvatarResizeObserver.ref.current);

					const x = calculateCoord(
						offset.left,
						executorFaceStyles.left,
						size.width,
						executorFaceStyles.width
					);
					const y = calculateCoord(
						offset.top,
						executorFaceStyles.top,
						size.height,
						executorFaceStyles.height
					);
					const scaleX = calculateScale(executorFaceStyles.width, size.width);
					const scaleY = calculateScale(executorFaceStyles.height, size.height);

					localStore.setNeededAvatarProps({ x, y, scaleX, scaleY });
				}
			),
		[localStore, promoStore, targetAvatarResizeObserver, targetCardResizeObserver]
	);

	return (
		<S.UsersLayer>
			<S.UserCardGroup
				ref={targetCardResizeObserver.ref}
				style={{
					top: `${normalize(targetUser.position.y) * 100}%`,
					left: `${normalize(targetUser.position.x) * 100}%`,
					transform: `translate3d(-50%, -50%, 0)`,
					pointerEvents: "none",
					opacity: 0,
				}}>
				<UserCard {...targetUser.data} avatarRef={targetAvatarResizeObserver.ref} />
			</S.UserCardGroup>
			<Observer>
				{() => (
					<S.ExecutorAvatarWrapper
						style={{
							...targetAvatarResizeObserver.getSize(),
							opacity: iterationControls.animated.toRange(
								iteration5.fromStartCenter - 0.001,
								iteration5.fromStartCenter
							),
							pointerEvents: iterationControls.animated
								.toRange(iteration5.fromStartCenter - 0.001, iteration5.fromStartCenter)
								.to((value) => (value >= 1 ? "auto" : "none")),
							top: `calc(${normalize(targetUser.position.y) * 100}% - ${
								targetAvatarResizeObserver.getSize().height / 2
							}px)`,
							left: `calc(${normalize(targetUser.position.x) * 100}% - ${
								targetCardResizeObserver.getSize().width / 2
							}px + 20px)`,
							x: iteration5.interpolations.closing.to((value) => value * localStore.neededAvatarProps.x),
							y: iteration5.interpolations.closing.to((value) => value * localStore.neededAvatarProps.y),
							scaleX: iteration5.interpolations.closing.to(
								(value) => 1 + (localStore.neededAvatarProps.scaleX - 1) * value
							),
							scaleY: iteration5.interpolations.closing.to(
								(value) => 1 + (localStore.neededAvatarProps.scaleY - 1) * value
							),
						}}>
						<S.ExecutorAvatar>
							<Image src={targetUser.data.avatarSource} />
						</S.ExecutorAvatar>
					</S.ExecutorAvatarWrapper>
				)}
			</Observer>
			<Observer>
				{() => (
					<>
						{users.map(({ position, data, inQueueIndex }, index) => (
							<S.UserCardGroup
								key={index}
								style={{
									top: `${(position.y / 2 + 0.5) * 100}%`,
									left: `${(position.x / 2 + 0.5) * 100}%`,
									transform: `translate3d(-50%, -50%, 0)`,
								}}>
								<S.UserCardWrapper
									style={{
										scale: iterationControls.store.inRange(iteration5.start, iteration5.fromStartCenter)
											? iteration5.interpolations.opening.to((value) =>
													iterationControls.range(
														value,
														inQueueIndex / users.length,
														(inQueueIndex + 1) / users.length
													)
											  )
											: iteration5.interpolations.closing
													.to((value) =>
														iterationControls.range(
															value,
															inQueueIndex / users.length,
															(inQueueIndex + 1) / users.length
														)
													)
													.to((value) => 1 - value),
									}}>
									<UserCard {...data} avatarRef={index === targetIndex ? targetAvatarRef : undefined} />
								</S.UserCardWrapper>
							</S.UserCardGroup>
						))}
					</>
				)}
			</Observer>
		</S.UsersLayer>
	);
};

const defaultUserData: UserCardProps = {
	avatarSource:
		"https://sun1.ufanet.userapi.com/s/v1/ig2/N5YaQEMGNCwEuVwMeKtc02p16zKMTRwTdVyHqksRVh2CR4QJT-uFoF8cOlyF8MO8dHb7pg9md7-xMPqRwS3v6QFR.jpg?size=400x492&quality=95&crop=748,4,924,1138&ava=1",
	name: "Nikita Osin",
};

const users: { inQueueIndex: number; data: UserCardProps; position: { x: number; y: number } }[] = [
	{ inQueueIndex: 0, data: { ...defaultUserData, rating: 4.5 }, position: { x: -0.7, y: 0.1 } },
	{ inQueueIndex: 5, data: { ...defaultUserData, size: "s" }, position: { x: -0.6, y: 0.7 } },
	{ inQueueIndex: 2, data: { ...defaultUserData, size: "s" }, position: { x: -0.5, y: -0.4 } },
	{ inQueueIndex: 4, data: { ...defaultUserData, size: "s" }, position: { x: -0.8, y: -0.65 } },
	//
	{ inQueueIndex: 6, data: { ...defaultUserData, rating: 4.5 }, position: { x: 0.6, y: 0.4 } },
	{ inQueueIndex: 1, data: { ...defaultUserData, size: "s" }, position: { x: 0.8, y: -0.1 } },
	{ inQueueIndex: 3, data: { ...defaultUserData, rating: 4.5 }, position: { x: 0.65, y: -0.7 } },
];

const targetIndex = 0;
const targetUser = users[targetIndex];

function normalize(x: number) {
	return x / 2 + 0.5;
}
