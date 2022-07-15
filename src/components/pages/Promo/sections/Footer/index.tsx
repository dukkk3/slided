import React, { forwardRef, useCallback } from "react";

import { useIterationsControls } from "@components/providers/IterationsControlsProvider";

import { Iteration } from "@components/pages/Promo/helpers/Iteration";

import { Button } from "@components/common/ui/Button";
import { Container } from "@components/common/ui/Container";
import { Icon, IconNameKind } from "@components/common/ui/Icon";

import { interpolations } from "@core/helpers/iteration.helper";

import { SlidingContainer } from "../../shared/SlidingContainer";
import { FooterInfo } from "../../shared/FooterInfo";

import { usePromo } from "../../index";

import * as S from "./styled";

interface Feature {
	icon: IconNameKind;
	title: React.ReactNode;
	description: React.ReactNode;
}

export interface Props {}

export const Footer = forwardRef<HTMLDivElement, Props>((_, ref) => {
	const promo = usePromo();
	const iterationsControls = useIterationsControls();

	const handleGetStartedButtonClick = useCallback(() => {
		promo.store.setFeedbackOpened(true);
	}, [promo]);

	return (
		<Iteration
			iterations={iterationsControls.iterations - 1}
			visibilitySwitch={{ unmountWhenInvisible: false }}
			checkForVisible={([lastIteration]) => lastIteration.started()}>
			{([lastIteration]) => (
				<S.Footer
					style={{
						y: lastIteration.interpolations.closing
							.to(interpolations.easing("easeInOutCubic"))
							.to(interpolations.invert)
							.to((value) => `${100 * value}%`),
					}}>
					<SlidingContainer
						ref={ref}
						onClose={() => iterationsControls.change(iterationsControls.partsAmount - 1)}>
						<Container>
							<S.Content>
								<div>
									<S.Head>
										<S.Title>Next slide!</S.Title>
										<S.ButtonWrapper>
											<Button size='m' onClick={handleGetStartedButtonClick}>
												Get Started
											</Button>
										</S.ButtonWrapper>
									</S.Head>
									<S.Features>
										{FEATURES.map((feature, index) => (
											<S.Feature key={index}>
												<S.FeatureHead>
													<S.FeatureIconWrapper>
														<Icon name={feature.icon} />
													</S.FeatureIconWrapper>
													<S.FeatureTitle>{feature.title}</S.FeatureTitle>
												</S.FeatureHead>
												<S.FeatureBody>
													<S.FeatureLineGroup />
													<S.FeatureDescription>{feature.description}</S.FeatureDescription>
												</S.FeatureBody>
											</S.Feature>
										))}
									</S.Features>
								</div>
								<FooterInfo />
							</S.Content>
						</Container>
					</SlidingContainer>
				</S.Footer>
			)}
		</Iteration>
	);
});

const FEATURES: Feature[] = [
	{
		icon: "Speed",
		title: "Fast",
		description: (
			<>
				Slide design proved by
				<br />
				thousands of use-cases and
				<br />
				based on 300+ templates
			</>
		),
	},
	{
		icon: "Verified",
		title: "Professional",
		description: (
			<>
				Made by verified designers
				<br />
				with A+ track record and
				<br />
				sharp eye for details
			</>
		),
	},
	{
		icon: "Savings",
		title: "Reasonable",
		description: (
			<>
				Best “value-for-money”
				<br />
				profit compared to top 10
				<br />
				freelance websites
			</>
		),
	},
	{
		icon: "Protect",
		title: "Secure",
		description: (
			<>
				Any of your information is
				<br />
				signed with NDA and secured
				<br />
				by SSL/HTTPS protocols
			</>
		),
	},
];
