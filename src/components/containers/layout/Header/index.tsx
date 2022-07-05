import { useCallback } from "react";

import { Image } from "@components/common/ui/Image";
import { Button } from "@components/common/ui/Button";

import { useGlobalStore } from "@core/hooks/useGlobalStore";

import { getVectorImageByName } from "@assets/images";

import * as S from "./styled";

export const Header: React.FC = () => {
	const layoutStore = useGlobalStore((store) => store.layout);

	const handleButtonClick = useCallback(() => {
		layoutStore.setFeedbackOpened(true);
	}, [layoutStore]);

	return (
		<S.Header>
			<S.Container>
				<S.Logo>
					<Image src={getVectorImageByName("common", "LogoSource")} lazy={false} />
				</S.Logo>
				<S.Navbar>
					<S.NavItem>
						<S.NavLink>How it works</S.NavLink>
					</S.NavItem>
					<S.NavItem>
						<S.NavLink>Pricing</S.NavLink>
					</S.NavItem>
					<S.NavItem>
						<Button onClick={handleButtonClick}>Get started</Button>
					</S.NavItem>
				</S.Navbar>
				<S.Burger />
			</S.Container>
		</S.Header>
	);
};
