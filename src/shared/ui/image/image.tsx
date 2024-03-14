import { forwardRef } from "react";

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
	forwardRef<HTMLPictureElement, ImageProps>(({ src, sources = [], alt = "", ...rest }, ref) => {
		return (
			<S.Picture {...rest} ref={ref}>
				{sources.map(({ src, media }) => (
					<source key={src} media={media} srcSet={src} />
				))}
				<S.Image src={src} alt={alt} />
			</S.Picture>
		);
	}),
	{ S }
);
