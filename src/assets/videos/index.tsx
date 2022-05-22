import * as videos from "./origins";

export type Videos = typeof videos;
export type VideoNameKind = keyof Videos;

export function getVideoByName(name: VideoNameKind) {
	return videos[name];
}
