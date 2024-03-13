import { iterationsChain } from "@shared/helpers";

export const ITERATIONS_CHAIN = iterationsChain
	.create()
	.next(1, { duration: 2000 })
	.next(2, { duration: 2000 })
	.next(3, { duration: 2000 })
	.next(4, { duration: 2000 })
	.get();
