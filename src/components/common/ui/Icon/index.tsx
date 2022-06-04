import React, { memo } from "react";
import classNames from "classnames";

import { KeysMatching } from "@core/types";

import { VectorImages, getVectorImageByName } from "@assets/images";

export type IconNameKind = KeysMatching<VectorImages["icons"], React.FC>;

export interface Props extends React.ComponentProps<"svg"> {
	name: IconNameKind;
}

export const Icon: React.FC<Props> = memo(({ name, ...rest }) => {
	return (
		<>
			{getVectorImageByName("icons", name, { ...rest, className: classNames(rest.className, "icon") })}
		</>
	);
});
