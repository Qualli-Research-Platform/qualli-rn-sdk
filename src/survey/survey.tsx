import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    Dimensions,
    Keyboard,
    Animated,
    Text,
    TouchableOpacity,
    Linking,
} from 'react-native';

import {
    Slide,
    SlideJump,
    SlideType,
    SlideJumpEndKey,
    SurveyTheme,
    Survey,
} from './../types';

import DynamicHeightView from './../common/dynamicHeightView';
import { evaluateJumpCondition } from './../helpers/logic';
import SurveyPanel from './base/panel/panel';
import SurveySlide from './base/slide/slide';
import SurveyHeading from './base/heading/heading';
import { DIRECT_ANWER_TYPES, SHOW_NEXT_TYPES } from '../config/slide.config';

interface Props {
    survey?: Survey;
    isVisible?: boolean;
    answers: { [key: string]: any };
    companyPlan: string;
    onComplete: () => void;
    onClose: () => void;
    onAnswer: (slideId: string, answer: any) => void;
    closeSurvey: () => void;
}

interface ScrollState {
    slides: JSX.Element[];
    currentIndex: number;
    currentSlide?: Slide;
    prevSlides?: Slide[];
    showNext: boolean;
}

const SurveyMain = (props: Props) => {
    const { survey, isVisible, onComplete, onClose, onAnswer, closeSurvey } =
        props;
    const backgroundColor = survey?.theme.background_color;

    const [currentState, setCurrentState] = useState({
        currentIndex: -1,
        slideHeights: {},
        completed: false,
        firstSlideRendered: false,
        slides: [] as JSX.Element[],
    });
    const slideHeights = React.useRef<any>({});
    const slidesScrollRef = React.useRef<ScrollView>(null);
    const localAnswers = React.useRef<{ [key: string]: string | number }>({});
    const scrollState = React.useRef<ScrollState>({
        slides: [],
        currentIndex: 0,
        showNext: false,
        currentSlide: undefined,
        prevSlides: [],
    });

    // Create an Animated.Value for controlling opacity
    const opacityAnim = React.useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isVisible && currentState?.slides.length === 0) {
            viewNextSlide(0);
        } else if (!isVisible) {
            resetState();
        }
    }, [isVisible]);

    const viewNextSlide = (newIndex: number) => {
        if (!survey) {
            return;
        }

        // going back
        if (newIndex < scrollState?.current?.currentIndex) {
            // @ts-ignore
            const nextSlide = scrollState?.current.prevSlides[
                newIndex
            ] as Slide;

            const updatedPrevSlides =
                newIndex > 0
                    ? scrollState.current.prevSlides?.slice(0, newIndex)
                    : [];

            const newScrollState = {
                ...scrollState.current,
                currentIndex: newIndex,
                // @ts-ignore
                currentSlide: nextSlide,
                prevSlides: updatedPrevSlides,
                showNext:
                    SHOW_NEXT_TYPES.indexOf(
                        // @ts-ignore
                        nextSlide[newIndex]?.type as SlideType,
                    ) > -1,
            };

            slideScrollAnimation(newIndex, newScrollState);
            return;
        }

        let slides = [...scrollState.current.slides];

        // Check if the current slide has logic and an answer has been provided
        const currentSlide = scrollState.current.currentSlide as Slide;
        let nextSlide = undefined;
        let goToEnd = false;

        if (currentSlide?.logic) {
            const jumps = currentSlide.logic.jumps;
            let matchedCondition: SlideJump | undefined = undefined;

            if (jumps.length > 0) {
                // loop over the jumps
                // evaluate the condition
                // if true -> set matchedCondition and break the loop to continue
                // if false -> continue
                for (let i = 0; i < jumps.length; i++) {
                    const jump = jumps[i];
                    const answer =
                        localAnswers.current[currentSlide.unique_identifier];

                    if (
                        evaluateJumpCondition(jump, answer, currentSlide.type)
                    ) {
                        matchedCondition = jump;
                        break;
                    }
                }
            }

            if (
                matchedCondition &&
                (matchedCondition.slide_unique_identifier ||
                    matchedCondition.slide_unique_identifier ===
                        SlideJumpEndKey)
            ) {
                // find the slide and assign it to nextSlide
                if (
                    matchedCondition.slide_unique_identifier === SlideJumpEndKey
                ) {
                    goToEnd = true;
                } else {
                    nextSlide = survey.slides.find(
                        slide =>
                            slide.unique_identifier ===
                            matchedCondition?.slide_unique_identifier,
                    );
                }
            }
        }

        // do we have a specific nextslide?
        // if yes -> we need to push it as the next slide and scroll
        // if no ->
        //     -> do we have a next slide?
        //         -> yes -> we need to push it as the next slide and scroll
        //         -> no -> do we have a outro slide?
        //             -> yes -> we need to push it as the next slide and scroll
        //             -> no -> we are done
        if (!!nextSlide) {
            // we have a specific next slide
            // we need to push it as the next slide and scroll
            slides = addSlide(slides, nextSlide, newIndex);
        } else {
            // we do not have a specific next slide
            // do we have a next slide?
            if (newIndex === 0) {
                nextSlide = survey.slides[0];
            } else {
                if (!goToEnd) {
                    // Find the next slide based on order or other criteria
                    nextSlide = survey.slides.find(
                        slide =>
                            slide.order ===
                            (scrollState.current.currentSlide
                                ?.order as number) +
                                1,
                    );
                }
            }

            if (!!nextSlide) {
                slides = addSlide(slides, nextSlide, newIndex);
            } else {
                // do we have an outro slide?
                if (survey.outro) {
                    onComplete();
                    slides = addOutroSlide(slides, newIndex);
                } else {
                    // we reached the end
                    setCurrentState(_ => {
                        return {
                            ...currentState,
                        };
                    });

                    // survey has been finished
                    onComplete();
                    closeSurvey();
                    return;
                }
            }
        }

        let updatedPrevSlides = [
            ...(scrollState.current.prevSlides as Slide[]),
        ];

        if (newIndex > scrollState?.current.currentIndex) {
            updatedPrevSlides.push(scrollState.current.currentSlide as Slide);
        } else if (newIndex === 0) {
            updatedPrevSlides = [];
        }

        const newScrollState = {
            slides: slides,
            currentIndex: newIndex,
            currentSlide: nextSlide,
            showNext:
                SHOW_NEXT_TYPES.indexOf(nextSlide?.type as SlideType) > -1,
            prevSlides: updatedPrevSlides,
        };

        slideScrollAnimation(newIndex, newScrollState);
    };

    const slideScrollAnimation = async (
        newIndex: number,
        newScrollState: ScrollState,
    ) => {
        // fade out
        await fadeScrollview(false, 0);
        // set the state
        scrollState.current = newScrollState;

        setCurrentState(prevState => {
            return {
                ...prevState,
                currentIndex: newIndex,
                slides: newScrollState.slides,
            };
        });
        // scroll the view
        scrollViewScrollTo(newIndex);

        // fade back in
        fadeScrollview(true, 300);
    };

    const fadeScrollview = (
        toVisible: boolean,
        delay: number,
    ): Promise<void> => {
        return new Promise((resolve: any) => {
            Animated.timing(opacityAnim, {
                toValue: toVisible ? 1 : 0,
                duration: 200,
                useNativeDriver: true,
                delay: delay ? delay : 0,
            }).start(() => {
                resolve();
            });
        });
    };

    const addOutroSlide = (slides: JSX.Element[], newIndex: number) => {
        const slidesCopy = [...slides];
        const survey = props.survey as Survey;

        slidesCopy.push(
            <ScrollView
                scrollEnabled={false}
                key={'outro'}
                style={[
                    {
                        width: Dimensions.get('window').width,
                    },
                ]}
            >
                <SurveySlide
                    index={newIndex.toString()}
                    slide={{
                        unique_identifier: 'outro',
                        type: SlideType.outro,
                        title:
                            survey?.outro?.title || 'Thank you for your time!',
                        subtitle:
                            survey?.outro?.subtitle ||
                            'We appreciate your feedback.',
                        button_label: survey?.outro?.button_label || 'Done',
                    }}
                    theme={survey.theme as SurveyTheme}
                    isFreePlan={props.companyPlan === 'free'}
                    onHeightLayout={handleSlideHeightChange}
                    onNext={() => closeSurvey()}
                    onAnswerChange={_ => {}}
                />
            </ScrollView>,
        );
        return slidesCopy;
    };

    const addSlide = (
        slides: JSX.Element[],
        slide: Slide,
        newIndex: number,
    ) => {
        const slidesCopy = [...slides];
        const nextSlideCopy = { ...slide };
        const survey = props.survey as Survey;

        slidesCopy.push(
            <ScrollView
                scrollEnabled={false}
                key={nextSlideCopy.unique_identifier + '-' + newIndex}
                style={[
                    {
                        width: Dimensions.get('window').width,
                    },
                ]}
            >
                <SurveySlide
                    index={newIndex.toString()}
                    slide={nextSlideCopy as any}
                    theme={survey.theme}
                    isFreePlan={props.companyPlan === 'free'}
                    onHeightLayout={handleSlideHeightChange}
                    onAnswerChange={val => {
                        onSlideAnswerChange(
                            nextSlideCopy.unique_identifier,
                            val,
                            nextSlideCopy.type,
                        );
                    }}
                    onNext={() =>
                        nextPress(SHOW_NEXT_TYPES.includes(nextSlideCopy.type))
                    }
                    onPrevious={newIndex > 0 ? () => prevPress() : undefined}
                />
            </ScrollView>,
        );

        return slidesCopy;
    };

    const onSlideAnswerChange = (
        slideId: string,
        value: any,
        type: SlideType,
    ) => {
        localAnswers.current = {
            ...localAnswers?.current,
            [slideId]: value,
        };

        if (DIRECT_ANWER_TYPES.indexOf(type) > -1) {
            viewNextSlide(scrollState?.current?.currentIndex + 1);
            onAnswer(slideId, value);
        }
    };

    const onPanelDoneClosing = () => {};

    const resetState = () => {
        scrollState.current = { slides: [], currentIndex: 0, showNext: false };
        slideHeights.current = {};
        setCurrentState({
            currentIndex: -1,
            slideHeights: {},
            completed: false,
            firstSlideRendered: false,
            slides: [],
        });
    };

    const scrollViewScrollTo = (index: number) => {
        setTimeout(() => {
            slidesScrollRef?.current?.scrollTo({
                x: Dimensions.get('window').width * index,
                y: 0,
                animated: false,
            });

            setTimeout(() => {
                cleanupScrollStateOnAnimationEnd();
            }, 150);
        }, 200);
    };

    const cleanupScrollStateOnAnimationEnd = () => {
        if (
            scrollState?.current?.currentIndex <
            scrollState?.current?.slides.length - 1
        ) {
            // remove the last item
            scrollState.current = {
                ...scrollState?.current,
                slides: scrollState?.current?.slides.slice(
                    0,
                    scrollState?.current?.currentIndex + 1,
                ),
            };
        }
    };

    const nextPress = (saveAnswer = false) => {
        if (
            survey?.slides[scrollState?.current?.currentIndex]?.type === 'input'
        ) {
            Keyboard.dismiss();
        }

        if (
            saveAnswer &&
            scrollState?.current?.currentSlide?.unique_identifier
        ) {
            onAnswer(
                scrollState?.current?.currentSlide?.unique_identifier,
                localAnswers?.current[
                    scrollState?.current?.currentSlide?.unique_identifier
                ] || null,
            );
        }

        viewNextSlide(scrollState?.current?.currentIndex + 1);
    };

    const prevPress = () => {
        viewNextSlide(scrollState?.current?.currentIndex - 1);
    };

    const handleSlideHeightChange = (height: number, slideIndex: string) => {
        if (height <= 0) return;

        setCurrentState(prevState => {
            // Compute new slide heights based on the previous state
            const newSlideHeights = {
                ...prevState.slideHeights,
                [slideIndex]: height > 0 ? Math.ceil(height) : 100,
            };

            slideHeights.current = newSlideHeights;

            return {
                ...prevState,
                slideHeights: newSlideHeights,
            };
        });

        // Return the new state
        if (!currentState.firstSlideRendered) {
            setTimeout(() => {
                setCurrentState(prevState => {
                    return {
                        ...prevState,
                        firstSlideRendered: true,
                    };
                });
            }, 1000);
        }
    };

    const openQualliWebsiteIfSupported = async () => {
        const url =
            'https://usequalli.com?utm_source=qualli&utm_medium=poweredby&utm_campaign=qualli_mobile';
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            // Opening the link with some app, if the URL scheme is "http" the web link should be opened
            // by some browser in the mobile
            Linking.openURL(url);
        }
    };

    if (!survey) {
        return null;
    }

    return (
        <SurveyPanel
            key={'main-panel'}
            backgroundColor={backgroundColor}
            isVisible={!!isVisible && currentState.firstSlideRendered}
            onDoneClosing={onPanelDoneClosing}
        >
            <SurveyHeading
                key={'heading'}
                theme={survey?.theme}
                onClose={onClose}
            />

            <DynamicHeightView
                key={'dynamic-height-view'}
                height={
                    !isVisible
                        ? 0
                        : currentState.slideHeights[
                              `${currentState.currentIndex}` as keyof typeof currentState.slideHeights
                          ] || 0
                }
                delay={0}
            >
                <Animated.ScrollView
                    key={'survey-slide-container'}
                    ref={slidesScrollRef}
                    style={[
                        {
                            opacity: opacityAnim,
                        },
                    ]}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                    onContentSizeChange={() =>
                        scrollViewScrollTo(scrollState?.current?.currentIndex)
                    }
                >
                    {currentState?.slides}
                </Animated.ScrollView>
            </DynamicHeightView>

            {props.companyPlan === 'free' && (
                <TouchableOpacity onPress={openQualliWebsiteIfSupported}>
                    <Text
                        style={[
                            styles.footerText,
                            {
                                color: survey.theme.title_color,
                            },
                        ]}
                    >
                        Powered by Qualli
                    </Text>
                </TouchableOpacity>
            )}
        </SurveyPanel>
    );
};

const styles = StyleSheet.create({
    footerText: {
        fontSize: 12,
        marginBottom: 24,
        textAlign: 'center',
    },
});

export default SurveyMain;
