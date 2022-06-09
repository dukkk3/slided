import { reaction } from "mobx";
import { useSpring } from "react-spring";
import { useEffect, useRef } from "react";

import { Promo } from "@components/containers/promo/Promo";
import { Tariff } from "@components/containers/promo/Tariff";
import { Assistant } from "@components/containers/promo/Assistant";
import { Executors } from "@components/containers/promo/Executors";
import { TemplatesGrid } from "@components/containers/promo/TemplatesGrid";
import { PhoneAssistant } from "@components/containers/promo/PhoneAssistant";
import { PhoneTemplates } from "@components/containers/promo/PhoneTemplates";
import { TableBackground } from "@components/containers/promo/TableBackground";
import { Pulses } from "@components/containers/promo/Pulses";

import { MovedGridTemplate } from "@components/containers/promo/MovedGridTemplate";
import { MovedExecutorFace } from "@components/containers/promo/MovedExecutorFace";
import { MovedAssistantFace } from "@components/containers/promo/MovedAssistantFace";
import { MovedCursorTemplate } from "@components/containers/promo/MovedCursorTemplate";

import { Loader } from "@components/common/ui/Loader";

import { DebugIterationControls } from "@components/common/simple/DebugIterationControls";

import { PromoContainer } from "@components/common/ui/PromoContainer";

import { useGlobalStore, useResizeObserver } from "@core/hooks";

import { getRasterImageByName, getRasterImagesByNames } from "@assets/images";

import * as S from "./styled";
import { animationHelper } from "@core/helpers";
import { Observer } from "mobx-react-lite";

export const Sandbox: React.FC = () => {
	const [loaderStyle, loaderApi] = useSpring(() => ({ opacity: 1 }));

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

	const promoStore = useGlobalStore((store) => store.layout.promo);

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

	useEffect(
		() =>
			reaction(
				() => promoStore.videoLoaded,
				async (videoLoaded) => {
					if (videoLoaded && !promoStore.loaderHidden) {
						await animationHelper.resolveSpringAnimation(loaderApi, { opacity: 0 });
						promoStore.setLoaderHidden(true);
					}
				}
			),
		[loaderApi, promoStore]
	);

	return (
		<S.Sandbox ref={sandboxRef}>
			<DebugIterationControls />
			<TableBackground />
			<Observer>
				{() =>
					!promoStore.loaderHidden ? (
						<S.LoaderGroup style={loaderStyle}>
							<Loader />
						</S.LoaderGroup>
					) : null
				}
			</Observer>
			<S.LayerWrapper>
				<PromoContainer>
					<Pulses />
					<Promo />
					<Assistant faceContainerRef={assistantContainerRef} />
					<PhoneAssistant
						templates={getRasterImagesByNames(
							"BrightTemplate",
							"GreenTemplate",
							"BlueTemplate",
							"BeigeTemplate",
							"BlackTemplate"
						)}
						assistantContainerRef={phoneAssistantContainerRef}
						shiftedAssistantContainerRef={shiftedAssistantContainerRef}
						executorContainerRef={phoneExecutorContainerRef}
					/>
					<Executors faceContainerRef={executorContainerRef} />
					<MovedCursorTemplate
						templateSource={getRasterImageByName("Car")}
						cursorAvatarSource={getRasterImageByName("Man1")}
						endContainerRef={phoneTemplateContainerRef}
					/>
					<PhoneTemplates
						templates={getRasterImagesByNames("Car", "ColaCharts", "Plug", "Plug", "Plug").map(
							(source, index) => ({
								source,
								overlaySource: index === 1 ? getRasterImageByName("Plug") : undefined,
							})
						)}
						templateContainerRef={phoneTemplateContainerRef}
						shiftedTemplateContainerRef={phoneShiftedTemplateContainerRef}
					/>
					<TemplatesGrid
						templates={GRID_TEMPLATES}
						templateContainerRef={gridTemplateContainerRef}
						hidden
					/>
					<TemplatesGrid templates={GRID_TEMPLATES} />
					<Tariff />
				</PromoContainer>
				<MovedGridTemplate
					templateSource={getRasterImageByName("Car")}
					startContainerRef={phoneShiftedTemplateContainerRef}
					endContainerRef={gridTemplateContainerRef}
				/>
				<MovedAssistantFace
					startContainerRef={assistantContainerRef}
					middleContainerRef={phoneAssistantContainerRef}
					endContainerRef={shiftedAssistantContainerRef}
				/>
				<MovedExecutorFace
					avatarSource={getRasterImageByName("Man1")}
					startContainerRef={executorContainerRef}
					endContainerRef={phoneExecutorContainerRef}
				/>
			</S.LayerWrapper>
		</S.Sandbox>
	);
};

const GRID_TEMPLATES = [
	[
		getRasterImageByName("Work4"),
		getRasterImageByName("Work1"),
		getRasterImageByName("Work10"),
		getRasterImageByName("Work11"),
		getRasterImageByName("Work2"),
	],
	[
		getRasterImageByName("Work10"),
		getRasterImageByName("Work5"),
		getRasterImageByName("Car"),
		getRasterImageByName("Work6"),
		getRasterImageByName("Work3"),
	],
	[
		getRasterImageByName("Work7"),
		getRasterImageByName("Work9"),
		getRasterImageByName("Work2"),
		getRasterImageByName("Work8"),
		getRasterImageByName("Work7"),
	],
];
