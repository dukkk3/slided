import { createContext, useContext, useEffect, useRef } from "react";
import { a, useSpring } from "react-spring";
import { Observer } from "mobx-react-lite";
import { reaction } from "mobx";

import { Layout } from "@components/containers/Layout";

import { IterationsControlsProvider } from "@components/providers/IterationsControlsProvider";

import { useLocalStore } from "@core/hooks/useLocalStore";
import { useBreakpoint } from "@core/hooks/useBreakpoint";
import { useResizeObserver } from "@core/hooks/useResizeObserver";
import { useTransformDifference } from "@core/hooks/useTransformDifference";
import { interpolations } from "@core/helpers/iteration.helper";

import { Banner } from "./sections/Banner";
import { Assistant } from "./sections/Assistant";
import { LandscapePlug } from "./sections/LandscapePlug";
import { Designers, TARGET_USER } from "./sections/Designers";
import { Presentation, presentationFramesDesktop } from "./sections/Presentation";
import { PhoneAssistant } from "./sections/PhoneAssistant";
import { PhoneTemplates } from "./sections/PhoneTemplates";
import { GridTemplates } from "./sections/GridTemplates";
import { Background } from "./sections/Background";
import { Tariffs } from "./sections/Tariffs";
import { Feedback } from "./sections/Feedback";
import { Loader } from "./sections/Loader";
import { Pulses } from "./sections/Pulses";
import { Footer } from "./sections/Footer";

import { MovedAssistantFace } from "./moved/MovedAssistantFace";
import { MovedDesignerFace } from "./moved/MovedDesignerFace";
import { MovedTemplate } from "./moved/MovedTemplate";

import { DebugIterationControls } from "./helpers/DebugIterationControls";
import { SwipeControls } from "./helpers/SwipeControls";
import { Controls } from "./helpers/Controls";

import { PromoContainer } from "./shared/PromoContainer";

import { getRasterImagesByNames, getRasterImageByName } from "@assets/images";

import * as S from "./styled";

type UseResizeObserverReturnType = ReturnType<typeof useResizeObserver>;
type UseTransformDifferenceReturnType = ReturnType<typeof useTransformDifference>;

interface Context {
	store: {
		readonly canShowContent: boolean;
		readonly interactiveEnabled: boolean;
		sequenceLoaded: boolean;
		loaderHidden: boolean;
		feedbackOpened: boolean;
		promoBannerOpened: boolean;
		backgroundAnimationEnded: boolean;
		setFeedbackOpened: (value: boolean) => void;
		setLoaderHidden: (value: boolean) => void;
		setPromoBannerOpened: (value: boolean) => void;
		setSequenceLoaded: (value: boolean) => void;
		setBackgroundAnimationEnded: (value: boolean) => void;
	};
	transforms: {
		executorAndPhoneExecutor: UseTransformDifferenceReturnType;
		bigTemplateAndPhoneTemplate: UseTransformDifferenceReturnType;
		phoneTemplateAndGridTemplate: UseTransformDifferenceReturnType;
		bigAssistantAndPhoneAssistant: UseTransformDifferenceReturnType;
		phoneAssistantAndShiftedAssistant: UseTransformDifferenceReturnType;
	};
	resizeObservers: {
		phoneCard: UseResizeObserverReturnType;
		phoneCardsContainer: UseResizeObserverReturnType;
	};
	refs: {
		footerContent: React.RefObject<HTMLDivElement>;
	};
}

const context = createContext<Context>(null!);

export const Promo: React.FC = () => {
	const breakpoint = useBreakpoint();
	const [promoStyle, promoApi] = useSpring(() => ({ opacity: 0 }));
	const [feedbackStyle, feedbackApi] = useSpring(() => ({ y: 0 }));
	const footerContentRef = useRef<any>(null);
	const phoneCardsContainerResizeObserver = useResizeObserver({
		debounce: 100,
		calculateSizeWithPaddings: true,
	});
	const phoneCardResizeObserver = useResizeObserver({
		debounce: 100,
		calculateSizeWithPaddings: true,
	});

	const transformBtwExecutorAndPhoneExecutor = useTransformDifference();
	const transformBtwPhoneTemplateAndGridTemplate = useTransformDifference();
	const transformBtwBigAssistantAndPhoneAssistant = useTransformDifference();
	const transformBtwPhoneAssistantAndShiftedAssistant = useTransformDifference();
	const transformBtwBigTemplateAndPhoneTemplate = useTransformDifference({ resizeType: "rect" });

	const localStore = useLocalStore<Context["store"]>({
		loaderHidden: false,
		sequenceLoaded: false,
		feedbackOpened: false,
		promoBannerOpened: false,
		backgroundAnimationEnded: false,
		setFeedbackOpened: function (value) {
			this.feedbackOpened = value;
		},
		setLoaderHidden: function (value) {
			this.loaderHidden = value;
		},
		setBackgroundAnimationEnded: function (value) {
			this.backgroundAnimationEnded = value;
		},
		setPromoBannerOpened: function (value) {
			this.promoBannerOpened = value;
		},
		setSequenceLoaded: function (value) {
			this.sequenceLoaded = value;
		},
		get interactiveEnabled() {
			return (
				this.promoBannerOpened &&
				this.backgroundAnimationEnded &&
				!(breakpoint.mobile() && breakpoint.landscape())
			);
		},
		get canShowContent() {
			return this.sequenceLoaded && this.loaderHidden;
		},
	});

	useEffect(
		() =>
			reaction(
				() => localStore.canShowContent,
				(canShow) => {
					if (canShow) promoApi.start({ opacity: 1 });
				}
			),
		[localStore, promoApi]
	);

	useEffect(
		() =>
			reaction(
				() => localStore.feedbackOpened,
				(opened) => {
					feedbackApi.start({ y: opened ? 1 : 0 });
				}
			),
		[feedbackApi, localStore]
	);

	return (
		<context.Provider
			value={{
				store: localStore,
				resizeObservers: {
					phoneCard: phoneCardResizeObserver,
					phoneCardsContainer: phoneCardsContainerResizeObserver,
				},
				transforms: {
					executorAndPhoneExecutor: transformBtwExecutorAndPhoneExecutor,
					bigTemplateAndPhoneTemplate: transformBtwBigTemplateAndPhoneTemplate,
					phoneTemplateAndGridTemplate: transformBtwPhoneTemplateAndGridTemplate,
					bigAssistantAndPhoneAssistant: transformBtwBigAssistantAndPhoneAssistant,
					phoneAssistantAndShiftedAssistant: transformBtwPhoneAssistantAndShiftedAssistant,
				},
				refs: {
					footerContent: footerContentRef,
				},
			}}>
			<a.div style={promoStyle}>
				<Observer>
					{() => (
						<IterationsControlsProvider
							defaultDuration={2000}
							parts={[
								{ from: 0, to: 1 },
								{ from: 1, to: 2 },
								{ from: 2, to: 3 },
								[
									{ from: 3, to: 4 },
									{ from: 4, to: 4.5 },
									{ from: 4.5, to: 5, duration: 2500 },
									{ from: 5, to: 6 },
								],
								[
									{ from: 6, to: 7 },
									{ from: 7, to: 7.5, duration: 5000 },
									{ from: 7.5, to: 8 },
								],
								{ from: 8, to: 9 },
								[
									{ from: 9, to: 9.5, duration: 2000 },
									{ from: 9.5, to: 10 },
								],
								{ from: 10, to: 11 },
								{ from: 11, to: 12 },
							]}
							enabled={localStore.interactiveEnabled}>
							<Layout header={{ onGetStartedClick: () => localStore.setFeedbackOpened(true) }}>
								<S.Promo>
									<Background />
									<PromoContainer>
										<DebugIterationControls />
										{/*  */}
										<Pulses />
										<Banner />
										<Assistant />
										<PhoneAssistant
											templatesSources={getRasterImagesByNames(
												"BrightTemplate",
												"GreenTemplate",
												"BlueTemplate",
												"BeigeTemplate",
												"BlackTemplate"
											)}
										/>
										<Presentation templateSource={CAR_TEMPLATE_SOURCE} />
										<PhoneTemplates
											templates={[
												CAR_TEMPLATE_SOURCE,
												...getRasterImagesByNames("ColaCharts", "Plug", "Plug", "Plug"),
											].map((source, index) => ({
												source,
												overlaySource: index === 1 ? getRasterImageByName("Plug") : undefined,
											}))}
										/>
										<GridTemplates templatesSources={GRID_TEMPLATES} hidden />
										<GridTemplates templatesSources={GRID_TEMPLATES} />
										<Tariffs />
									</PromoContainer>
									<Designers />
									<MovedTemplate templateSource={CAR_TEMPLATE_SOURCE} />
									<MovedAssistantFace />
									<MovedDesignerFace avatarSource={TARGET_USER.data.avatarSource} />
								</S.Promo>
							</Layout>
							<S.SlidingGroup
								style={{ y: feedbackStyle.y.to(interpolations.invert).to((value) => `${value * 100}vh`) }}>
								<Feedback />
							</S.SlidingGroup>
							<S.SlidingGroup style={{ y: feedbackStyle.y.to((value) => `${value * 100}vh`) }}>
								<Footer ref={footerContentRef} />
								<Controls />
							</S.SlidingGroup>
							<SwipeControls />
						</IterationsControlsProvider>
					)}
				</Observer>
			</a.div>
			<Observer>
				{() => (breakpoint.mobile() && breakpoint.landscape() ? <LandscapePlug /> : null)}
			</Observer>
			<Loader />
		</context.Provider>
	);
};

export function usePromo() {
	return useContext(context);
}

const CAR_TEMPLATE_SOURCE = presentationFramesDesktop[presentationFramesDesktop.length - 1];

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
