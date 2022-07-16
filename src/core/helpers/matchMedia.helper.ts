import { media, mediaIos } from "k2-media";
import {pick} from "@core/utils/common.utils";

export const mediaQueries = {
   ...pick(mediaIos, 'iPhone', '')  
}

function 

function toMatchMediaQuery(query: string) {
	return query.replace(/^@media only screen and[ ]?/, "");
}
