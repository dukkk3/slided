import React, { memo } from "react";

import { FullScreenContainerLayout } from "@components/common/ordinary/FullScreenContainerLayout";
import { FooterInfo } from "@components/common/ordinary/FooterInfo";

import { Container } from "@components/common/ui/Container";
import { Button } from "@components/common/ui/Button";

import * as S from "./styled";

export const Feedback: React.FC = memo(() => {
	return (
		<S.Feedback>
			<FullScreenContainerLayout>
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
			</FullScreenContainerLayout>
		</S.Feedback>
	);
});
