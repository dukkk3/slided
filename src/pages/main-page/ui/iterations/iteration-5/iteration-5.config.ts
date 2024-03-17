import { designerConfig } from "../../designer";

import * as assets from "./assets";
import type { UserProps } from "./ui";

interface UserData {
	props: UserProps;
	inQueueIndex: number;
	position: Record<"x" | "y", number>;
}

export const FOCUSED_USER_INDEX = 0;
export const USERS: UserData[] = [
	{
		inQueueIndex: 0,
		props: { avatarSrc: designerConfig.DESIGNER_AVATAR, name: "Mark", rating: 4.5 },
		position: { x: -0.7, y: 0.1 },
	},
	{
		inQueueIndex: 5,
		props: { avatarSrc: assets.designer2, name: "Limba", size: "s" },
		position: { x: -0.6, y: 0.7 },
	},
	{
		inQueueIndex: 2,
		props: { avatarSrc: assets.designer3, name: "Piers", size: "s" },
		position: { x: -0.5, y: -0.4 },
	},
	{
		inQueueIndex: 4,
		props: { avatarSrc: assets.designer4, name: "David", size: "s" },
		position: { x: -0.8, y: -0.65 },
	},
	//
	{
		inQueueIndex: 6,
		props: { avatarSrc: assets.designer5, name: "Alex", rating: 4.7 },
		position: { x: 0.6, y: 0.4 },
	},
	{
		inQueueIndex: 1,
		props: { avatarSrc: assets.designer6, name: "Roza", size: "s" },
		position: { x: 0.8, y: -0.1 },
	},
	{
		inQueueIndex: 3,
		props: { avatarSrc: assets.designer7, name: "Margo", rating: 4.9 },
		position: { x: 0.65, y: -0.7 },
	},
];
