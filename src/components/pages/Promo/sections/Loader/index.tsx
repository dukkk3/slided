import { useRef, useCallback } from "react";
import { Transition } from "react-spring";
import { Observer } from "mobx-react-lite";

import { Loader as LoaderImpl } from "@components/common/ui/Loader";

import { usePromo } from "../../index";

import * as S from "./styled";

export const Loader: React.FC = () => {
	const promo = usePromo();
	const iterationsCountRef = useRef(0);

	const handleAnimationEnded = useCallback(() => {
		iterationsCountRef.current += 1;

		if (iterationsCountRef.current > 0 && promo.store.loaderVisible && promo.store.contentLoaded) {
			promo.store.setLoaderVisible(false);
		}
	}, [promo]);

	return (
		<Observer>
			{() => {
				return (
					<Transition
						items={promo.store.loaderVisible}
						initial={{ opacity: 1 }}
						enter={{
							opacity: 1,
							onRest: () => {
								iterationsCountRef.current = 0;
							},
						}}
						leave={{
							opacity: 0,
						}}>
						{(style, item) =>
							item && (
								<S.LoaderGroup style={style}>
									<LoaderImpl onAnimationEnded={handleAnimationEnded} />
								</S.LoaderGroup>
							)
						}
					</Transition>
				);
			}}
		</Observer>
	);
};
