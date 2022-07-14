import { Image } from "@components/common/ui/Image";
import { Button } from "@components/common/ui/Button";

import { getVectorImageByName } from "@assets/images";

import * as S from "./styled";

export interface Props {
	onGetStartedClick?: () => void;
}

export const Header: React.FC<Props> = ({ onGetStartedClick }) => {
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
						<Button onClick={onGetStartedClick}>Get started</Button>
					</S.NavItem>
				</S.Navbar>
				<S.Burger onClick={onGetStartedClick} />
			</S.Container>
		</S.Header>
	);
};
