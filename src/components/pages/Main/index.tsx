import { reaction, transaction } from "mobx";
import { useSpring } from "react-spring";
import { Observer } from "mobx-react-lite";
import { createContext, useCallback, useEffect, useRef } from "react";
import { FullGestureState, useGesture } from "@use-gesture/react";

import { Promo } from "./sections/Promo";
import { Tariff } from "./sections/Tariff";
import { Pulses } from "./sections/Pulses";
import { Assistant } from "./sections/Assistant";
import { Executors } from "./sections/Executors";
import { SlidingFooter } from "./sections/SlidingFooter";
import { TemplatesGrid } from "./sections/TemplatesGrid";
import { PhoneAssistant } from "./sections/PhoneAssistant";
import { PhoneTemplates } from "./sections/PhoneTemplates";
import { BackgroundSequence, BackgroundFrame } from "./sections/BackgroundSequence";

import { MovedGridTemplate } from "./flying/MovedGridTemplate";
import { MovedExecutorFace } from "./flying/MovedExecutorFace";
import { MovedAssistantFace } from "./flying/MovedAssistantFace";
import { MovedCursorTemplate } from "./flying/MovedCursorTemplate";

import { DebugIterationControls } from "@components/common/ui/DebugIterationControls";

import { Loader } from "@components/common/ui/Loader";
import { PromoContainer } from "@components/common/ui/PromoContainer";

import { useIteration } from "@core/hooks/useIteration";
import { useBreakpoint } from "@core/hooks/useBreakpoint";
import { useGlobalStore } from "@core/hooks/useGlobalStore";
import { useResizeObserver } from "@core/hooks/useResizeObserver";
import { useIterationsControls } from "@core/hooks/useIterationsControls";
import { useTransformDifference } from "@core/hooks/useTransformDifference";
import { resolveSpringAnimation } from "@core/helpers/animation.helper";
import { createArray, mergeRefs } from "@core/utils/common.utils";

import { getRasterImageByName, getRasterImagesByNames } from "@assets/images";

import * as S from "./styled";
import { interpolations } from "@core/helpers/iteration.helper";

type UseTransformDifferenceReturnType = ReturnType<typeof useTransformDifference>;

export interface TransformsContext {
	readonly executorAndPhoneExecutor: UseTransformDifferenceReturnType;
	readonly bigAssistantAndPhoneAssistant: UseTransformDifferenceReturnType;
	readonly phoneAssistantAndShiftedAssistant: UseTransformDifferenceReturnType;
	readonly bigTemplateAndPhoneTemplate: UseTransformDifferenceReturnType;
	readonly phoneTemplateAndGridTemplate: UseTransformDifferenceReturnType;
	readonly phoneCardResizeObserver: ReturnType<typeof useResizeObserver>;
	readonly phoneCardsContainerResizeObserver: ReturnType<typeof useResizeObserver>;
}

export const transformsContext = createContext<TransformsContext>(null!);

export const Main: React.FC = () => {
	const [loaderStyle, loaderApi] = useSpring(() => ({ opacity: 1 }));

	const transformBtwExecutorAndPhoneExecutor = useTransformDifference();
	const transformBtwBigTemplateAndPhoneTemplate = useTransformDifference({ resizeType: "rect" });
	const transformBtwPhoneTemplateAndGridTemplate = useTransformDifference();
	const transformBtwBigAssistantAndPhoneAssistant = useTransformDifference();
	const transformBtwPhoneAssistantAndShiftedAssistant = useTransformDifference();
	const phoneCardsContainerResizeObserver = useResizeObserver({
		debounce: 100,
		calculateSizeWithPaddings: true,
	});
	const phoneCardResizeObserver = useResizeObserver({
		debounce: 100,
		withOffset: false,
		calculateSizeWithPaddings: true,
	});

	const transforms: TransformsContext = {
		executorAndPhoneExecutor: transformBtwExecutorAndPhoneExecutor,
		bigAssistantAndPhoneAssistant: transformBtwBigAssistantAndPhoneAssistant,
		phoneAssistantAndShiftedAssistant: transformBtwPhoneAssistantAndShiftedAssistant,
		bigTemplateAndPhoneTemplate: transformBtwBigTemplateAndPhoneTemplate,
		phoneTemplateAndGridTemplate: transformBtwPhoneTemplateAndGridTemplate,
		phoneCardsContainerResizeObserver,
		phoneCardResizeObserver,
	};

	const sandboxRef = useRef<HTMLDivElement>(null);
	const footerRef = useRef<HTMLDivElement>(null);

	const phoneAssistantResizeObserver = useResizeObserver();
	const phoneTemplatesRef = useRef<HTMLDivElement>(null);

	const phoneTemplateResizeObserver = useResizeObserver({ debounce: 100 });

	const iterationsControls = useIterationsControls();
	const lastIteration = useIteration(iterationsControls.iterations);
	const layoutStore = useGlobalStore((store) => store.layout);
	const promoStore = useGlobalStore((store) => store.layout.promo);
	const breakpoint = useBreakpoint();

	const hideLoader = useCallback(async () => {
		if (promoStore.sequenceLoaded && !promoStore.loaderHidden) {
			await resolveSpringAnimation(loaderApi, { opacity: 0 });
			promoStore.setLoaderHidden(true);
		}
	}, [loaderApi, promoStore]);

	const updateBackgroundType = useCallback(() => {
		const useFrame = breakpoint.mobile();

		transaction(() => {
			if (useFrame) {
				promoStore.setSequenceOpeningAnimationEnded(true);
				promoStore.setSequenceLoaded(true);
			}

			promoStore.setBackgroundType(useFrame ? "frame" : "sequence");
		});
	}, [breakpoint, promoStore]);

	const createDotClickHandler = useCallback(
		(iteration: number) => () => {
			if (!promoStore.interactiveEnabled) return;
			iterationsControls.change(iteration);
		},
		[iterationsControls, promoStore.interactiveEnabled]
	);

	const updateCssProperties = useCallback(() => {
		const sandbox = sandboxRef.current;
		if (sandbox) {
			const size = phoneCardResizeObserver.getSize();
			sandbox.style.setProperty("--template-card-width", `${size.width}px`);
			sandbox.style.setProperty("--template-card-height", `${size.height}px`);
		}
	}, [phoneCardResizeObserver]);

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
				const footer = footerRef.current;

				if (!iterationsControls.enabled || layoutStore.feedbackOpened) return;
				if (lastIteration.started() && footer && footer.scrollTop > 0) return;

				return handleWheel(state);
			},
			onDrag: (state) => {
				const footer = footerRef.current;

				if (
					!iterationsControls.enabled ||
					!breakpoint.range("mobile", "laptop") ||
					layoutStore.feedbackOpened
				)
					return;
				if (lastIteration.started() && footer && footer.scrollTop > 0) return;

				return handleDrag(state);
			},
		},
		{ target: document, wheel: { axis: "y" }, drag: { axis: "y" } }
	);

	useEffect(
		() =>
			reaction(
				() => breakpoint.mobile(),
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

	useEffect(() => {
		updateCssProperties();
	}, [updateCssProperties]);

	useEffect(
		() =>
			reaction(
				() => phoneTemplateResizeObserver.getSize(),
				() => updateCssProperties()
			),
		[phoneTemplateResizeObserver, updateCssProperties]
	);

	useEffect(() => {
		promoStore.setWasMounted(true);
	}, [promoStore]);

	return (
		<>
			<S.Sandbox ref={sandboxRef}>
				<DebugIterationControls />
				<Observer>
					{() =>
						promoStore.backgroundType === "sequence" ? (
							<>
								<S.TableBackgroundWrapper style={{ opacity: loaderStyle.opacity.to((value) => 1 - value) }}>
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
				<transformsContext.Provider value={transforms}>
					<S.LayerWrapper>
						<PromoContainer>
							<Pulses />
							<Promo />
							<Assistant faceContainerRef={transformBtwBigAssistantAndPhoneAssistant.startRef} />
							<PhoneAssistant
								templates={getRasterImagesByNames(
									"BrightTemplate",
									"GreenTemplate",
									"BlueTemplate",
									"BeigeTemplate",
									"BlackTemplate"
								)}
								cardsContainerRef={phoneCardsContainerResizeObserver.ref}
								assistantContainerRef={mergeRefs(
									transformBtwBigAssistantAndPhoneAssistant.endRef,
									transformBtwPhoneAssistantAndShiftedAssistant.startRef
								)}
								shiftedAssistantContainerRef={transformBtwPhoneAssistantAndShiftedAssistant.endRef}
								executorContainerRef={transformBtwExecutorAndPhoneExecutor.endRef}
							/>
							<Executors faceContainerRef={transformBtwExecutorAndPhoneExecutor.startRef} />
							<PhoneTemplates
								ref={phoneTemplatesRef}
								templates={[
									CAR_TEMPLATE_SOURCE,
									...getRasterImagesByNames("ColaCharts", "Plug", "Plug", "Plug"),
								].map((source, index) => ({
									source,
									overlaySource: index === 1 ? getRasterImageByName("Plug") : undefined,
								}))}
								templateContainerRef={mergeRefs(
									transformBtwBigTemplateAndPhoneTemplate.endRef,
									phoneCardResizeObserver.ref
								)}
								shiftedTemplateContainerRef={transformBtwPhoneTemplateAndGridTemplate.startRef}
							/>
							<TemplatesGrid
								templates={GRID_TEMPLATES}
								templateContainerRef={transformBtwPhoneTemplateAndGridTemplate.endRef}
								hidden
							/>
							<TemplatesGrid templates={GRID_TEMPLATES} />
							<Tariff />
							<MovedCursorTemplate
								containerRef={transforms.bigTemplateAndPhoneTemplate.startRef}
								templateSource={CAR_TEMPLATE_SOURCE}
							/>
						</PromoContainer>
						<MovedGridTemplate templateSource={CAR_TEMPLATE_SOURCE} />
						<MovedAssistantFace />
						<MovedExecutorFace avatarSource={getRasterImageByName("Man1")} />
					</S.LayerWrapper>
				</transformsContext.Provider>
			</S.Sandbox>
			<SlidingFooter ref={footerRef} />
			<S.Dots style={{ opacity: loaderStyle.opacity.to((value) => 1 - value) }}>
				<S.DotGroup>
					<S.FlyingDot
						style={{
							y: iterationsControls.animated.progress
								.to((value) => value * iterationsControls.iterations)
								.to((value) =>
									value >= 6 && value <= 8 ? 6 + (1 * (value - 6)) / 2 : value > 8 ? value - 1 : value
								)
								.to((value) => `${value * 100}%`),
						}}
					/>
					<Observer>
						{() => (
							<>
								{createArray(iterationsControls.iterations + 1).map((_, index) =>
									index === 7 ? null : (
										<S.Dot
											data-key={index}
											key={index}
											onClick={createDotClickHandler(index)}
											$active={iterationsControls.store.iteration === index}
										/>
									)
								)}
							</>
						)}
					</Observer>
				</S.DotGroup>
			</S.Dots>
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

const CAR_TEMPLATE_SOURCE = `https://ik.imagekit.io/64nah4dsw/slided/present_sequence/${String(
	126
).padStart(3, "0")}.jpg`;

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
		CAR_TEMPLATE_SOURCE,
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
