import { Button } from "@components/common/ui/Button";
import React, { memo } from "react";

import * as S from "./styled";

export const Plans: React.FC = memo(() => {
	return (
		<S.Plans>
			<S.PlanCard>
				<S.PlanName>Basic</S.PlanName>
				<S.PlanBody>
					<S.PlanContent>
						<S.PlanPriceWrapper>
							<S.PlanPrice>$15</S.PlanPrice>
							<S.PlanPriceLabel>/moth</S.PlanPriceLabel>
						</S.PlanPriceWrapper>
						<S.PlanDescription>
							Good start for individuals or small
							<br />
							business making presentations
							<br />
							occasionally
						</S.PlanDescription>
					</S.PlanContent>
					<S.PlanFeatures>
						<li>Up to 20 slides</li>
						<li>PDF file</li>
					</S.PlanFeatures>
				</S.PlanBody>
				<S.ButtonWrapper>
					<Button theme='dark'>Choose</Button>
				</S.ButtonWrapper>
			</S.PlanCard>
		</S.Plans>
	);
});
