import React, { memo, useCallback } from "react";

import { FooterInfo } from "@components/common/ordinary/FooterInfo";

import { Button } from "@components/common/ui/Button";
import { Container } from "@components/common/ui/Container";
import { Icon, IconNameKind } from "@components/common/ui/Icon";
import { FillingContainer } from "@components/common/ui/FillingContainer";

import { useGlobalStore } from "@core/hooks/useGlobalStore";

import * as S from "./styled";

interface Feature {
	icon: IconNameKind;
	title: React.ReactNode;
	description: React.ReactNode;
}

export interface Props {
	scrollingElementRef?: React.ForwardedRef<any>;
}

export const Footer: React.FC<Props> = memo(({ scrollingElementRef }) => {
	const layoutStore = useGlobalStore((store) => store.layout);

	const handleGetStartedButtonClick = useCallback(() => {
		layoutStore.setFeedbackOpened(true);
	}, [layoutStore]);

	return (
		<S.Footer>
			<FillingContainer ref={scrollingElementRef}>
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
			</FillingContainer>
		</S.Footer>
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
