import React, { memo } from "react";

import { Container } from "@components/common/ui/Container";
import { Button } from "@components/common/ui/Button";

import { SlidingContainer } from "../../shared/SlidingContainer";
import { FooterInfo } from "../../shared/FooterInfo";

import { usePromo } from "../../index";

import * as S from "./styled";

export const Feedback: React.FC = memo(() => {
	const promo = usePromo();

	return (
		<S.Feedback>
			<SlidingContainer onClose={() => promo.store.setFeedbackOpened(false)}>
				<div>
					<Container>
						<S.Content>
							<S.Head>
								<S.Title>We are happy to talk!</S.Title>
								<S.Form>
									<S.InputGroup>
										<S.Input placeholder="What's your name?" />
										<S.Input placeholder="What's your email?" />
									</S.InputGroup>
									<Button size='m'>Submit</Button>
								</S.Form>
							</S.Head>
							<FooterInfo />
						</S.Content>
					</Container>
				</div>
			</SlidingContainer>
		</S.Feedback>
	);
});
