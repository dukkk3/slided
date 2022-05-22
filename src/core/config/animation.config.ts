import { Transition } from "framer-motion";

function asTransition(transition: Transition) {
	return transition;
}

export const defaultSpringTransition = asTransition({
	type: "spring",
	stiffness: 120,
	damping: 25,
});
