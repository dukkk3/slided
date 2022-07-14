import { useRef, useCallback } from "react";
import { Transition } from "react-spring";
import { Observer } from "mobx-react-lite";

import { Loader as LoaderImpl } from "@components/common/ui/Loader";

import { useLocalStore } from "@core/hooks/useLocalStore";

import { usePromo } from "../../index";

import * as S from "./styled";

export const Loader: React.FC = () => {
	const promo = usePromo();
	const iterationsCountRef = useRef(0);
	const localStore = useLocalStore({ visible: true });

	const handleAnimationEnded = useCallback(() => {
		iterationsCountRef.current += 1;

		if (iterationsCountRef.current > 0 && !promo.store.loaderHidden) {
			localStore.setVisible(false);
		}
	}, [localStore, promo]);

	return (
		<Observer>
			{() => (
				<Transition
					items={promo.store.loaderHidden ? false : localStore.visible}
					initial={{ opacity: 1 }}
					enter={{ opacity: 1 }}
					leave={{ opacity: 0, onRest: () => promo.store.setLoaderHidden(true) }}>
					{(style, item) =>
						item && (
							<S.LoaderGroup style={style}>
								<LoaderImpl onAnimationEnded={handleAnimationEnded} />
							</S.LoaderGroup>
						)
					}
				</Transition>
			)}
		</Observer>
	);
};
