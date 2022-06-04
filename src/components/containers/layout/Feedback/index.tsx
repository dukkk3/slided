// import React, { memo, useRef } from "react";

// import { FullScreenContainerLayout } from "@components/common/ui/FillingContainer";
// import { FooterInfo } from "@components/common/ordinary/FooterInfo";

// import { Container } from "@components/common/ui/Container";
// import { Button } from "@components/common/ui/Button";

// import { useGlobalStore, useOnClickOutside } from "@core/hooks";

// import * as S from "./styled";

// export const Feedback: React.FC = memo(() => {
// 	const containerWrapperRef = useRef<HTMLDivElement>(null);
// 	const layoutStore = useGlobalStore((store) => store.layout);

// 	useOnClickOutside(containerWrapperRef, () => {
// 		layoutStore.setFeedbackOpened(false);
// 	});

// 	return (
// 		<S.Feedback>
// 			<FullScreenContainerLayout>
// 				<div ref={containerWrapperRef}>
// 					<Container>
// 						<S.Content>
// 							<S.Head>
// 								<S.Title>We are happy to talk!</S.Title>
// 								<S.Form>
// 									<S.InputGroup>
// 										<S.Input placeholder="What's your name?" />
// 										<S.Input placeholder="What's your email?" />
// 									</S.InputGroup>
// 									<Button size='m'>Submit</Button>
// 								</S.Form>
// 							</S.Head>
// 							<FooterInfo />
// 						</S.Content>
// 					</Container>
// 				</div>
// 			</FullScreenContainerLayout>
// 		</S.Feedback>
// 	);
// });
export {};
