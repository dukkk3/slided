import { Image } from "@components/common/ui/Image";
import { Button } from "@components/common/ui/Button";

import { getVectorImageByName } from "@assets/images";

import * as S from "./styled";

export const Header: React.FC = () => {
	return (
		<S.Header>
			<S.Container>
				<S.Logo>
					<Image src={getVectorImageByName("LogoSource")} lazy={false} />
				</S.Logo>
				<S.Navbar>
					<S.NavItem>
						<S.NavLink>How it works</S.NavLink>
					</S.NavItem>
					<S.NavItem>
						<S.NavLink>Pricing</S.NavLink>
					</S.NavItem>
					<S.NavItem>
						<Button>Get started</Button>
					</S.NavItem>
				</S.Navbar>
			</S.Container>
		</S.Header>
	);
};
