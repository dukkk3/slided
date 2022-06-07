import { reaction } from "mobx";
import { useEffect, useRef } from "react";

import { Promo } from "@components/containers/promo/Promo";
import { Tariff } from "@components/containers/promo/Tariff";
import { Assistant } from "@components/containers/promo/Assistant";
import { Executors } from "@components/containers/promo/Executors";
import { TemplatesGrid } from "@components/containers/promo/TemplatesGrid";
import { PhoneAssistant } from "@components/containers/promo/PhoneAssistant";
import { PhoneTemplates } from "@components/containers/promo/PhoneTemplates";
import { TableBackground } from "@components/containers/promo/TableBackground";

import { MovedGridTemplate } from "@components/containers/promo/MovedGridTemplate";
import { MovedExecutorFace } from "@components/containers/promo/MovedExecutorFace";
import { MovedAssistantFace } from "@components/containers/promo/MovedAssistantFace";
import { MovedCursorTemplate } from "@components/containers/promo/MovedCursorTemplate";

import { DebugIterationControls } from "@components/common/simple/DebugIterationControls";

import { PromoContainer } from "@components/common/ui/PromoContainer";

import { useResizeObserver } from "@core/hooks";

import { getRasterImageByName, getRasterImagesByNames } from "@assets/images";

import * as S from "./styled";

export const Sandbox: React.FC = () => {
	const sandboxRef = useRef<HTMLDivElement>(null);
	const gridTemplateContainerRef = useRef<any>(null);
	const phoneTemplateContainerRef = useRef<any>(null);
	const phoneShiftedTemplateContainerRef = useRef<any>(null);
	const assistantContainerRef = useRef<any>(null);
	const phoneAssistantContainerRef = useRef<any>(null);
	const shiftedAssistantContainerRef = useRef<any>(null);
	const executorContainerRef = useRef<any>(null);
	const phoneExecutorContainerRef = useRef<any>(null);

	const phoneTemplateResizeObserver = useResizeObserver({ ref: phoneTemplateContainerRef });

	useEffect(
		() =>
			reaction(
				() => phoneTemplateResizeObserver.getSize(),
				(size) => {
					const sandbox = sandboxRef.current;
					if (!sandbox) return;
					sandbox.style.setProperty("--template-card-width", `${size.width}px`);
					sandbox.style.setProperty("--template-card-height", `${size.height}px`);
				}
			),
		[phoneTemplateResizeObserver]
	);

	return (
		<S.Sandbox ref={sandboxRef}>
			<DebugIterationControls />
			{/* <TableBackground /> */}
			<S.LayerWrapper>
				<PromoContainer>
					<Promo />
					<Assistant faceContainerRef={assistantContainerRef} />
					<PhoneAssistant
						templates={getRasterImagesByNames(
							"BeigeTemplateSource",
							"Blue2TemplateSource",
							"BrightTemplateSource",
							"CarTemplateSource",
							"CarTemplateSource"
						)}
						assistantContainerRef={phoneAssistantContainerRef}
						shiftedAssistantContainerRef={shiftedAssistantContainerRef}
						executorContainerRef={phoneExecutorContainerRef}
					/>
					{/* <Executors faceContainerRef={executorContainerRef} /> */}
					<MovedCursorTemplate
						templateSource={getRasterImageByName("CarTemplateSource")}
						cursorAvatarSource={getRasterImageByName("CompiledTemplate9")}
						endContainerRef={phoneTemplateContainerRef}
					/>
					<PhoneTemplates
						templates={getRasterImagesByNames(
							"CarTemplateSource",
							"Blue2TemplateSource",
							"BrightTemplateSource",
							"CarTemplateSource"
						).map((source) => ({ source }))}
						templateContainerRef={phoneTemplateContainerRef}
						shiftedTemplateContainerRef={phoneShiftedTemplateContainerRef}
					/>
					<TemplatesGrid
						templates={GRID_TEMPLATES}
						templateContainerRef={gridTemplateContainerRef}
						hidden
					/>
					<TemplatesGrid templates={GRID_TEMPLATES} />
					{/* <Tariff /> */}
				</PromoContainer>
				<MovedGridTemplate
					templateSource={getRasterImageByName("CarTemplateSource")}
					startContainerRef={phoneShiftedTemplateContainerRef}
					endContainerRef={gridTemplateContainerRef}
				/>
				<MovedAssistantFace
					startContainerRef={assistantContainerRef}
					middleContainerRef={phoneAssistantContainerRef}
					endContainerRef={shiftedAssistantContainerRef}
				/>
				<MovedExecutorFace
					avatarSource={getRasterImageByName("CompiledTemplate1")}
					startContainerRef={executorContainerRef}
					endContainerRef={phoneExecutorContainerRef}
				/>
			</S.LayerWrapper>
		</S.Sandbox>
	);
};

const GRID_TEMPLATES = [
	[
		getRasterImageByName("CompiledTemplate4"),
		getRasterImageByName("CompiledTemplate1"),
		getRasterImageByName("CompiledTemplate10"),
		getRasterImageByName("CompiledTemplate11"),
		getRasterImageByName("CompiledTemplate2"),
	],
	[
		getRasterImageByName("CompiledTemplate10"),
		getRasterImageByName("CompiledTemplate5"),
		getRasterImageByName("CarTemplateSource"),
		getRasterImageByName("CompiledTemplate6"),
		getRasterImageByName("CompiledTemplate3"),
	],
	[
		getRasterImageByName("CompiledTemplate7"),
		getRasterImageByName("CompiledTemplate9"),
		getRasterImageByName("CompiledTemplate2"),
		getRasterImageByName("CompiledTemplate8"),
		getRasterImageByName("CompiledTemplate7"),
	],
];
