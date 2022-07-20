import { Image } from "@components/common/ui/Image";
import { Button } from "@components/common/ui/Button";

import { getVectorImageByName } from "@assets/images";

import * as S from "./styled";
import { useIterationsControls } from "@components/providers/IterationsControlsProvider";

export interface Props {
	onPricingNavItemClick?: () => void;
	onHowItWorksNavItemClick?: () => void;
	onGetStartedClick?: () => void;
}

export const Header: React.FC<Props> = ({
	onPricingNavItemClick,
	onHowItWorksNavItemClick,
	onGetStartedClick,
}) => {
	const iterationsControls = useIterationsControls();

	return (
		<S.Header>
			<S.Container>
				<S.Logo onClick={() => iterationsControls.change(0)}>
					<Image src={getVectorImageByName("common", "LogoSource")} lazy={false} />
				</S.Logo>
				<S.Navbar>
					{/* <S.NavItem>
						<S.NavLink role='button' onClick={() => iterationsControls.change(1)}>
							How it works
						</S.NavLink>
					</S.NavItem>
					<S.NavItem>
						<S.NavLink role='button' onClick={() => iterationsControls.change(8)}>
							Pricing
						</S.NavLink>
					</S.NavItem> */}
					<S.NavItem>
						<Button onClick={onGetStartedClick}>Get started</Button>
					</S.NavItem>
				</S.Navbar>
				<S.Burger onClick={onGetStartedClick} />
			</S.Container>
		</S.Header>
	);
};
