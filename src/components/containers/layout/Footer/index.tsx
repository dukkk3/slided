import React, { memo } from "react";

import { FullScreenContainerLayout } from "@components/common/ordinary/FullScreenContainerLayout";
import { FooterInfo } from "@components/common/ordinary/FooterInfo";

import { Button } from "@components/common/ui/Button";
import { Container } from "@components/common/ui/Container";
import { Icon, IconNameKind } from "@components/common/ui/Icon";

import * as S from "./styled";

interface Feature {
	icon: IconNameKind;
	title: React.ReactNode;
	description: React.ReactNode;
}

export const Footer: React.FC = memo(() => {
	return (
		<S.Footer>
			<FullScreenContainerLayout>
				<Container>
					<S.Content>
						<S.Head>
							<S.Title>
								Don't make
								<br />
								boring presentations.
								<br />
								Create with Slided
							</S.Title>
							<S.ButtonWrapper>
								<Button size='m'>Get Started</Button>
							</S.ButtonWrapper>
						</S.Head>
						<S.Features>
							{features.map((feature, index) => (
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
						<FooterInfo />
					</S.Content>
				</Container>
			</FullScreenContainerLayout>
		</S.Footer>
	);
});

const features: Feature[] = [
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
