import { reaction } from "mobx";
import { useSpring } from "react-spring";
import { Observer } from "mobx-react-lite";
import { useCallback, useEffect, useRef } from "react";
import { FullGestureState, useGesture } from "@use-gesture/react";

import { Promo } from "@components/containers/promo/Promo";
import { Tariff } from "@components/containers/promo/Tariff";
import { Assistant } from "@components/containers/promo/Assistant";
import { Executors } from "@components/containers/promo/Executors";
import { TemplatesGrid } from "@components/containers/promo/TemplatesGrid";
import { PhoneAssistant } from "@components/containers/promo/PhoneAssistant";
import { PhoneTemplates } from "@components/containers/promo/PhoneTemplates";
// import { TableBackground } from "@components/containers/promo/TableBackground";
import {
	BackgroundSequence,
	BackgroundFrame,
} from "@components/containers/promo/BackgroundSequence";
// import { TableSequence } from "@components/containers/promo/TableSequence";
import { Pulses } from "@components/containers/promo/Pulses";
import { SlidingFooter } from "@components/containers/promo/SlidingFooter";

import { MovedGridTemplate } from "@components/containers/promo/MovedGridTemplate";
import { MovedExecutorFace } from "@components/containers/promo/MovedExecutorFace";
import { MovedAssistantFace } from "@components/containers/promo/MovedAssistantFace";
import { MovedCursorTemplate } from "@components/containers/promo/MovedCursorTemplate";

import { DebugIterationControls } from "@components/common/smart/DebugIterationControls";

import { Loader } from "@components/common/ui/Loader";
import { PromoContainer } from "@components/common/ui/PromoContainer";

import {
	useBreakpoint,
	useGlobalStore,
	useIteration,
	useIterationsControls,
	useResizeObserver,
} from "@core/hooks";
import { animationHelper } from "@core/helpers";

import { getRasterImageByName, getRasterImagesByNames } from "@assets/images";

import * as S from "./styled";

export const Sandbox: React.FC = () => {
	const [loaderStyle, loaderApi] = useSpring(() => ({ opacity: 1 }));

	const sandboxRef = useRef<HTMLDivElement>(null);
	const footerRef = useRef<HTMLDivElement>(null);
	const gridTemplateContainerRef = useRef<any>(null);
	const phoneTemplateContainerRef = useRef<any>(null);
	const phoneShiftedTemplateContainerRef = useRef<any>(null);
	const assistantContainerRef = useRef<any>(null);
	const phoneAssistantContainerRef = useRef<any>(null);
	const shiftedAssistantContainerRef = useRef<any>(null);
	const executorContainerRef = useRef<any>(null);
	const phoneExecutorContainerRef = useRef<any>(null);
	const phoneCardsContainerRef = useRef<any>(null);

	const phoneAssistantResizeObserver = useResizeObserver();
	const phoneTemplatesRef = useRef<HTMLDivElement>(null);

	const phoneTemplateResizeObserver = useResizeObserver({ ref: phoneTemplateContainerRef });

	const iterationsControls = useIterationsControls();
	const lastIteration = useIteration(iterationsControls.iterations);
	const promoStore = useGlobalStore((store) => store.layout.promo);
	const breakpoint = useBreakpoint();

	const hideLoader = useCallback(async () => {
		if (promoStore.sequenceLoaded && !promoStore.loaderHidden) {
			await animationHelper.resolveSpringAnimation(loaderApi, { opacity: 0 });
			promoStore.setLoaderHidden(true);
		}
	}, [loaderApi, promoStore]);

	const updateBackgroundType = useCallback(() => {
		const useFrame = breakpoint.range("mobile", "tablet");
		promoStore.setBackgroundType(useFrame ? "frame" : "sequence");
	}, [breakpoint, promoStore]);

	const handleWheel = useCallback(
		({ wheeling, direction: [, dy], memo, elapsedTime }: FullGestureState<"wheel">) => {
			const swipeEnabled = !wheeling || elapsedTime > 150;
			const memoIsNumber = typeof memo === "number";

			if (swipeEnabled && !memoIsNumber) return null;
			if (swipeEnabled && memoIsNumber) {
				const direction = memo as number;

				switch (direction) {
					case 1:
						iterationsControls.next();
						break;
					case -1:
						iterationsControls.prev();
						break;
				}

				return null;
			}

			return dy;
		},
		[iterationsControls]
	);

	const handleDrag = useCallback(
		({ swipe: [, sy] }: FullGestureState<"drag">) => {
			switch (-sy) {
				case 1:
					iterationsControls.next();
					break;
				case -1:
					iterationsControls.prev();
					break;
			}
		},
		[iterationsControls]
	);

	useGesture(
		{
			onWheel: (state) => {
				if (!iterationsControls.enabled || lastIteration.started()) return;
				return handleWheel(state);
			},
			onDrag: (state) => {
				if (
					!iterationsControls.enabled ||
					lastIteration.started() ||
					!breakpoint.range("mobile", "tablet")
				)
					return;
				return handleDrag(state);
			},
		},
		{ target: sandboxRef, wheel: { axis: "y" }, drag: { axis: "y" } }
	);

	useGesture(
		{
			onWheel: (state) => {
				const footer = footerRef.current;
				if (!iterationsControls.enabled || !footer || !lastIteration.started()) return;
				if (footer.scrollTop > 0) return 0;
				return handleWheel(state);
			},
			onDrag: (state) => {
				const footer = footerRef.current;
				if (
					!iterationsControls.enabled ||
					!breakpoint.range("mobile", "tablet") ||
					!footer ||
					footer.scrollTop > 0 ||
					!lastIteration.started()
				)
					return;
				return handleDrag(state);
			},
		},
		{ target: footerRef, wheel: { axis: "y" }, drag: { axis: "y" } }
	);

	useEffect(
		() =>
			reaction(
				() => breakpoint.getBreakpoint(),
				() => updateBackgroundType()
			),
		[breakpoint, updateBackgroundType]
	);

	useEffect(() => {
		updateBackgroundType();
	}, [updateBackgroundType]);

	useEffect(
		() =>
			reaction(
				() => phoneAssistantResizeObserver.getSize(),
				(size) => {
					const phoneTemplates = phoneTemplatesRef.current;
					if (!phoneTemplates) return;
					phoneTemplates.style.setProperty("height", `${size.height}px`);
				}
			),
		[phoneAssistantResizeObserver]
	);

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
		<>
			<S.Sandbox ref={sandboxRef}>
				<DebugIterationControls />
				<Observer>
					{() =>
						promoStore.backgroundType === "sequence" ? (
							<>
								<S.TableBackgroundWrapper style={{ opacity: loaderStyle.opacity.to((value) => 1 - value) }}>
									{/* <TableBackground /> */}
									<BackgroundSequence />
								</S.TableBackgroundWrapper>
								<Observer>
									{() =>
										!promoStore.loaderHidden ? (
											<S.LoaderGroup style={loaderStyle}>
												<PromoLoader onCanHide={hideLoader} />
											</S.LoaderGroup>
										) : null
									}
								</Observer>
							</>
						) : (
							<BackgroundFrame />
						)
					}
				</Observer>
				<S.LayerWrapper>
					<PromoContainer>
						<Pulses />
						<Promo />
						<Assistant faceContainerRef={assistantContainerRef} />
						<PhoneAssistant
							ref={phoneAssistantResizeObserver.ref}
							templates={getRasterImagesByNames(
								"BrightTemplate",
								"GreenTemplate",
								"BlueTemplate",
								"BeigeTemplate",
								"BlackTemplate"
							)}
							cardsContainerRef={phoneCardsContainerRef}
							assistantContainerRef={phoneAssistantContainerRef}
							shiftedAssistantContainerRef={shiftedAssistantContainerRef}
							executorContainerRef={phoneExecutorContainerRef}
						/>
						<Executors
							phoneCardsContainerRef={phoneCardsContainerRef}
							faceContainerRef={executorContainerRef}
						/>
						<MovedCursorTemplate
							templateSource={getRasterImageByName("Car")}
							cursorAvatarSource={getRasterImageByName("Man1")}
							endContainerRef={phoneTemplateContainerRef}
						/>
						<PhoneTemplates
							ref={phoneTemplatesRef}
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
			<SlidingFooter ref={footerRef} />
		</>
	);
};

interface PromoLoaderProps {
	onCanHide?: () => any;
}

const PromoLoader: React.FC<PromoLoaderProps> = ({ onCanHide }) => {
	const iterationsCountRef = useRef(0);
	const promoStore = useGlobalStore((store) => store.layout.promo);

	const handleAnimationEnded = useCallback(() => {
		iterationsCountRef.current += 1;

		if (iterationsCountRef.current > 0 && promoStore.sequenceLoaded && onCanHide) {
			onCanHide();
		}
	}, [onCanHide, promoStore]);

	return <Loader onAnimationEnded={handleAnimationEnded} />;
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
