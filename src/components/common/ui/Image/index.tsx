import React, { memo } from "react";

import * as S from "./styled";

export interface Props extends React.ComponentProps<"img"> {
	sources?: {
		src: string;
		media?: string;
	}[];
	lazy?: boolean;
}

export const Image: React.FC<Props> = memo(
	({ sources = [], alt = "", src = "", lazy = true, ...rest }) => {
		return (
			<S.Image className='noselect'>
				<S.Picture>
					{sources.length > 0
						? sources.map(({ src, media }, index) => (
								<source key={`image-source-${index}`} media={media} srcSet={src} />
						  ))
						: null}
					<S.NativeImage
						alt={alt}
						{...(rest as any)}
						{...(lazy ? { className: "lazyload", "data-src": src } : { src })}
					/>
				</S.Picture>
			</S.Image>
		);
	}
);
