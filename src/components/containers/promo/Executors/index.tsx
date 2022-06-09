import { easings } from "react-spring";
import { Observer } from "mobx-react-lite";

import { Iteration } from "@components/common/hoc/Iteration";
import { VisibilitySwitch } from "@components/common/hoc/VisibilitySwitch";

import { UserCard, Props as UserCardProps } from "@components/common/ordinary/UserCard";

import { useResizeObserver } from "@core/hooks";
import { mergeRefs, toRange, inlineSwitch, step } from "@core/utils";

import { getRasterImageByName } from "@assets/images";

import * as S from "./styled";

export interface Props extends React.ComponentProps<"div"> {
	faceContainerRef?: React.ForwardedRef<any>;
}

export const Executors: React.FC<Props> = ({ faceContainerRef, ...rest }) => {
	const targetAvatarResizeObserver = useResizeObserver();
	const targetCardResizeObserver = useResizeObserver();

	return (
		<S.Executors {...(rest as any)}>
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
						avatarRef={mergeRefs(faceContainerRef, targetAvatarResizeObserver.ref)}
					/>
				</S.UserCardGroup>
			</VisibilitySwitch>
			<Iteration iteration={5}>
				{(iteration5) => (
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
														iteration5.currentType() === "opening",
														iteration5.interpolations.opening
															.to((value) => toRange(value, 0, 0.5)) // .toEasing("easeInOutCubic")
															.to(
																(value) => value
																// toRange(value, inQueueIndex / USERS.length, (inQueueIndex + 1) / USERS.length)
															)
															.to({ easing: easings.easeInOutCubic, output: [0, 1], range: [0, 1] }),
														iteration5.interpolations.closing
															.to((value) => toRange(value, 0, 0.5)) // .toEasing("easeInOutCubic")
															.to(
																(value) => value
																// toRange(value, inQueueIndex / USERS.length, (inQueueIndex + 1) / USERS.length)
															)
															.to((value) => 1 - value)
															.to({ easing: easings.easeInOutCubic, output: [0, 1], range: [0, 1] })
													),
													scale: inlineSwitch(
														iteration5.currentType() === "opening",
														iteration5.interpolations.opening
															.to((value) =>
																toRange(value, inQueueIndex / USERS.length, (inQueueIndex + 1) / USERS.length)
															)
															.to({ easing: easings.easeInOutCubic, output: [0, 1], range: [0, 1] }),
														iteration5.interpolations.closing
															.to({ easing: easings.easeInOutCubic, output: [0, 1], range: [0, 1] })
															.to((value) => 1 - value)
													),
												}}>
												<UserCard
													{...data}
													avatarVisibleInterpolation={
														index === TARGET_INDEX
															? iteration5.interpolations
																	.toEasing("easeInOutQuart")
																	.closing.to((value) => 1 - step(value, 0.001))
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

const TARGET_INDEX = 0;
const TARGET_USER = USERS[TARGET_INDEX];

function normalize(x: number) {
	return x / 2 + 0.5;
}
