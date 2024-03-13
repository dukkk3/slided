import { memo } from "react";

import { AssignComponentProps } from "../assign-component-props";

import * as S from "./image.styled";

export interface ImageSource {
	src: string;
	media: string;
}

export interface ImageProps extends React.ComponentProps<"picture"> {
	src?: string;
	sources?: ImageSource[];
	alt?: string;
}

export const Image = AssignComponentProps(
	memo(({ src, sources = [], alt = "", ...rest }: ImageProps) => {
		return (
			<S.Picture {...rest}>
				{sources.map(({ src, media }) => (
					<source key={src} media={media} srcSet={src} />
				))}
				<S.Image src={src} alt={alt} />
			</S.Picture>
		);
	}),
	{ S }
);
