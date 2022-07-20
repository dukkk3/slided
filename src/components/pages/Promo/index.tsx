import React, { createContext, useContext, useEffect, useRef } from "react";
import { a, useSpring } from "react-spring";
import { Observer } from "mobx-react-lite";
import { reaction } from "mobx";

import { Layout } from "@components/containers/Layout";

import {
	IterationsControlsProvider,
	useIterationsControls,
} from "@components/providers/IterationsControlsProvider";

import { useLocalStore } from "@core/hooks/useLocalStore";
import { useBreakpoint } from "@core/hooks/useBreakpoint";
import { useResizeObserver } from "@core/hooks/useResizeObserver";
import { useTransformDifference } from "@core/hooks/useTransformDifference";
import { interpolations } from "@core/helpers/iteration.helper";
import { Store } from "@core/helpers/factories/schema.factory.helper";

import { Banner } from "./sections/Banner";
import { Assistant } from "./sections/Assistant";
import { LandscapePlug } from "./sections/LandscapePlug";
import { Designers, TARGET_USER } from "./sections/Designers";
import { Presentation, SEQUENCE_DESKTOP } from "./sections/Presentation";
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
	store: Store.Schema<{
		loaderVisible: boolean;
		sequenceCanPlay: boolean;
		feedbackOpened: boolean;
		presentationCanPlay: boolean;
		assistantFaceCanPlay: boolean;
		backgroundOpeningEnded: boolean;
		promoBannerOpeningEnded: boolean;
		readonly contentLoaded: boolean;
		readonly contentCanShow: boolean;
		readonly interactiveEnabled: boolean;
		readonly domManipulationsReady: boolean;
		readonly mobileDeviceTypeWithLandscapeOrientation: boolean;
	}>;
	transforms: {
		executorAndPhoneExecutor: UseTransformDifferenceReturnType;
		bigTemplateAndPhoneTemplate: UseTransformDifferenceReturnType;
		phoneTemplateAndGridTemplate: UseTransformDifferenceReturnType;
		bigAssistantAndPhoneAssistant: UseTransformDifferenceReturnType;
		phoneAssistantAndShiftedAssistant: UseTransformDifferenceReturnType;
	};
	resizeObservers: {
		gridRow: UseResizeObserverReturnType;
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
	const gridRowResizeObserver = useResizeObserver({ debounce: 100 });

	const transformBtwExecutorAndPhoneExecutor = useTransformDifference();
	const transformBtwPhoneTemplateAndGridTemplate = useTransformDifference();
	const transformBtwBigAssistantAndPhoneAssistant = useTransformDifference({ logging: true });
	const transformBtwPhoneAssistantAndShiftedAssistant = useTransformDifference();
	const transformBtwBigTemplateAndPhoneTemplate = useTransformDifference({ resizeType: "rect" });

	const localStore = useLocalStore({
		loaderVisible: true,
		feedbackOpened: false,
		sequenceCanPlay: false,
		presentationCanPlay: false,
		assistantFaceCanPlay: false,
		backgroundOpeningEnded: false,
		promoBannerOpeningEnded: false,
		get mobileDeviceTypeWithLandscapeOrientation() {
			return breakpoint.mobile() && breakpoint.landscape();
		},
		get domManipulationsReady() {
			return [
				gridRowResizeObserver,
				phoneCardResizeObserver,
				phoneCardsContainerResizeObserver,
				transformBtwBigTemplateAndPhoneTemplate,
				transformBtwPhoneTemplateAndGridTemplate,
				transformBtwBigAssistantAndPhoneAssistant,
				transformBtwBigAssistantAndPhoneAssistant,
				transformBtwPhoneAssistantAndShiftedAssistant,
			].every((transformDifference) => transformDifference.ready());
		},
		get contentLoaded() {
			return (
				this.presentationCanPlay &&
				this.sequenceCanPlay &&
				(this.domManipulationsReady || breakpoint.mobile() || breakpoint.tablet()) &&
				this.assistantFaceCanPlay
			);
		},
		get contentCanShow() {
			return (
				!this.loaderVisible &&
				this.sequenceCanPlay &&
				this.presentationCanPlay &&
				this.domManipulationsReady
			);
		},
		get interactiveEnabled() {
			return (
				this.domManipulationsReady &&
				this.backgroundOpeningEnded &&
				this.promoBannerOpeningEnded &&
				!this.loaderVisible &&
				!this.mobileDeviceTypeWithLandscapeOrientation
			);
		},
	});

	useEffect(
		() =>
			reaction(
				() => !localStore.contentLoaded,
				(showLoader) => {
					if (showLoader) localStore.setLoaderVisible(showLoader);
				}
			),
		[localStore]
	);

	useEffect(
		() =>
			reaction(
				() => localStore.feedbackOpened,
				(opened) => feedbackApi.start({ y: opened ? 1 : 0 })
			),
		[feedbackApi, localStore]
	);

	return (
		<context.Provider
			value={{
				store: localStore,
				resizeObservers: {
					gridRow: gridRowResizeObserver,
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
							<HiddenContent>
								<S.Promo>
									<Background />
									<PromoContainer>
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
							</HiddenContent>
						</Layout>
						<S.SlidingGroup
							style={{ y: feedbackStyle.y.to(interpolations.invert).to((value) => `${value * 100}vh`) }}>
							<Feedback />
						</S.SlidingGroup>
						<S.SlidingGroup style={{ y: feedbackStyle.y.to((value) => `${value * 100}vh`) }}>
							<Footer ref={footerContentRef} />
						</S.SlidingGroup>
						<Controls />
						<SwipeControls />
						<DebugIterationControls />
					</IterationsControlsProvider>
				)}
			</Observer>
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

const HiddenContent: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
	const iterationsControls = useIterationsControls();
	return (
		<a.div style={{ opacity: iterationsControls.hideContentInterpolation.to(interpolations.invert) }}>
			{children}
		</a.div>
	);
};

const CAR_TEMPLATE_SOURCE = SEQUENCE_DESKTOP.sources[SEQUENCE_DESKTOP.sources.length - 1];

const GRID_TEMPLATES = [
	[
		getRasterImageByName("Work1"),
		getRasterImageByName("Work2"),
		getRasterImageByName("Work9"),
		getRasterImageByName("Work5"),
		getRasterImageByName("Work4"),
		getRasterImageByName("Work1"),
		getRasterImageByName("Work10"),
		getRasterImageByName("Work11"),
		getRasterImageByName("Work2"),
	],
	[
		getRasterImageByName("Work16"),
		getRasterImageByName("Work14"),
		getRasterImageByName("Work15"),
		getRasterImageByName("Work17"),
		CAR_TEMPLATE_SOURCE,
		getRasterImageByName("Work6"),
		getRasterImageByName("Work3"),
		getRasterImageByName("Work13"),
		getRasterImageByName("Work12"),
	],
	[
		getRasterImageByName("Work7"),
		getRasterImageByName("Work9"),
		getRasterImageByName("Work2"),
		getRasterImageByName("Work8"),
		getRasterImageByName("Work10"),
		getRasterImageByName("Work11"),
		getRasterImageByName("Work12"),
		getRasterImageByName("Work16"),
		getRasterImageByName("Work17"),
	],
];
