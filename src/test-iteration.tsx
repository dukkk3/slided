// import React from "react";
// import { animated } from "@react-spring/web";
// import { useUnit } from "effector-react";

// import { math, common } from "./shared/utils";
// import { progress } from "./shared/model";
// import { runToIteration, runToProgress, smoothedDistanceOfBiggestStep } from "./shared/iterations";
// import { springUtils, iterationUtils } from "./shared/helpers";

// const iteration1 = iterationUtils.createStoreUtils(0);
// const { progress: progress1 } = iterationUtils.createSpringUtils(0);
// const iteration2 = iterationUtils.createStoreUtils(1);
// const { progress: progress2 } = iterationUtils.createSpringUtils(1);

// export const IterationTest = () => {
// 	const iteration1InFlight = useUnit(iteration1.$inFlight);

// 	return (
// 		<>
// 			<animated.p
// 				style={springUtils.optimizeStyleRendering({
// 					x: progress1,
// 					opacity: smoothedDistanceOfBiggestStep.to(math.invert),
// 					background: common.variant({
// 						if: iteration1InFlight,
// 						then: progress1
// 							.to((value) => springUtils.withInFlight(value))
// 							.to((value) => springUtils.withStatus(value))
// 							.to(({ inFlight }) => (inFlight ? "blue" : "orange")),
// 						else: progress2
// 							.to(springUtils.withInFlight)
// 							.to(({ inFlight }) => (inFlight ? "red" : "green")),
// 					}),
// 				})}>
// 				{progress}
// 			</animated.p>
// 			<button onClick={() => runToIteration(0)}>Iteration: 0</button>
// 			<button onClick={() => runToProgress(1)}>Progress: 1</button>
// 			<button onClick={() => runToIteration(1, true)}>Iteration: 1</button>
// 		</>
// 	);
// };
export {};
