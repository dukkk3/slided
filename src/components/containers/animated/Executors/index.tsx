import { Interpolation } from "react-spring";
import { Observer } from "mobx-react-lite";

import { VisibilitySwitch } from "@components/common/hoc/VisibilitySwitch";

import { UserCard, Props as UserCardProps } from "@components/common/ordinary/UserCard";

import { useIterationControls, useResizeObserver } from "@core/hooks";
import { mergeRefs } from "@core/utils";

import * as S from "./styled";

export interface Props {
	renderExecutorFace: (payload: {
		Component: typeof S.ExecutorAvatar;
		data: UserCardProps;
	}) => React.ReactNode;
	openingInterpolation: Interpolation<number, number>;
	closingInterpolation: Interpolation<number, number>;
	executorFaceRef?: React.ForwardedRef<any>;
	type: "opening" | "closing";
}

export const Executors: React.FC<Props> = ({
	renderExecutorFace,
	executorFaceRef,
	openingInterpolation,
	closingInterpolation,
	type,
}) => {
	const targetAvatarResizeObserver = useResizeObserver();
	const targetCardResizeObserver = useResizeObserver();
	const iterationControls = useIterationControls();

	return (
		<S.Executors>
			<VisibilitySwitch visible={false}>
				<S.UserCardGroup
					ref={targetCardResizeObserver.ref}
					style={{
						top: `${normalize(TARGET_USER.position.y) * 100}%`,
						left: `${normalize(TARGET_USER.position.x) * 100}%`,
						transform: `translate3d(-50%, -50%, 0)`,
					}}>
					<UserCard
						{...TARGET_USER.data}
						avatarRef={mergeRefs(executorFaceRef, targetAvatarResizeObserver.ref)}
					/>
				</S.UserCardGroup>
			</VisibilitySwitch>
			<Observer>
				{() => (
					<VisibilitySwitch visible={type === "closing"}>
						<S.ExecutorAvatarWrapper
							style={{
								...targetAvatarResizeObserver.getSize(),
								top: `calc(${normalize(TARGET_USER.position.y) * 100}% - ${
									targetAvatarResizeObserver.getSize().height / 2
								}px)`,
								left: `calc(${normalize(TARGET_USER.position.x) * 100}% - ${
									targetCardResizeObserver.getSize().width / 2
								}px + 20px)`,
							}}>
							{renderExecutorFace({ Component: S.ExecutorAvatar, data: TARGET_USER.data })}
						</S.ExecutorAvatarWrapper>
					</VisibilitySwitch>
				)}
			</Observer>
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
										scale:
											type === "opening"
												? openingInterpolation.to((value) =>
														iterationControls.toRange(
															value,
															inQueueIndex / USERS.length,
															(inQueueIndex + 1) / USERS.length
														)
												  )
												: closingInterpolation
														.to((value) =>
															iterationControls.toRange(
																value,
																inQueueIndex / USERS.length,
																(inQueueIndex + 1) / USERS.length
															)
														)
														.to((value) => 1 - value),
									}}>
									<UserCard {...data} />
								</S.UserCardWrapper>
							</S.UserCardGroup>
						))}
					</>
				)}
			</Observer>
		</S.Executors>
	);
};

const DEFAULT_USER_DATA: UserCardProps = {
	avatarSource:
		"https://sun1.ufanet.userapi.com/s/v1/ig2/N5YaQEMGNCwEuVwMeKtc02p16zKMTRwTdVyHqksRVh2CR4QJT-uFoF8cOlyF8MO8dHb7pg9md7-xMPqRwS3v6QFR.jpg?size=400x492&quality=95&crop=748,4,924,1138&ava=1",
	name: "Nikita Osin",
};

const USERS: { inQueueIndex: number; data: UserCardProps; position: { x: number; y: number } }[] = [
	{ inQueueIndex: 0, data: { ...DEFAULT_USER_DATA, rating: 4.5 }, position: { x: -0.7, y: 0.1 } },
	{ inQueueIndex: 5, data: { ...DEFAULT_USER_DATA, size: "s" }, position: { x: -0.6, y: 0.7 } },
	{ inQueueIndex: 2, data: { ...DEFAULT_USER_DATA, size: "s" }, position: { x: -0.5, y: -0.4 } },
	{ inQueueIndex: 4, data: { ...DEFAULT_USER_DATA, size: "s" }, position: { x: -0.8, y: -0.65 } },
	//
	{ inQueueIndex: 6, data: { ...DEFAULT_USER_DATA, rating: 4.5 }, position: { x: 0.6, y: 0.4 } },
	{ inQueueIndex: 1, data: { ...DEFAULT_USER_DATA, size: "s" }, position: { x: 0.8, y: -0.1 } },
	{ inQueueIndex: 3, data: { ...DEFAULT_USER_DATA, rating: 4.5 }, position: { x: 0.65, y: -0.7 } },
];

const TARGET_INDEX = 0;
const TARGET_USER = USERS[TARGET_INDEX];

function normalize(x: number) {
	return x / 2 + 0.5;
}
