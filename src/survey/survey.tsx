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

const SurveyMain = (props: Props) => {
    const { survey, isVisible, onComplete, onClose, onAnswer, closeSurvey } =
        props;
    const backgroundColor = survey?.theme.background_color;

    const [currentState, setCurrentState] = useState({
        currentIndex: -1,
        slideHeights: {},
        completed: false,
        scrolling: true,
    });
    const [isNew, setIsNew] = useState(true);
    const [isSurveyActive, setIsSurveyActive] = useState(false);
    const slideHeights = React.useRef<any>({});
    const slidesScrollRef = React.useRef<ScrollView>(null);
    const localAnswers = React.useRef<{ [key: string]: string | number }>({});
    const scrollState = React.useRef<{
        slides: JSX.Element[];
        currentIndex: number;
        currentSlide?: Slide;
        prevSlides?: Slide[];
        showNext: boolean;
    }>({
        slides: [],
        currentIndex: 0,
        showNext: false,
        currentSlide: undefined,
        prevSlides: [],
    });

    // Create an Animated.Value for controlling opacity
    const opacityAnim = React.useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Animate the opacity when currentState.scrolling changes
        Animated.timing(opacityAnim, {
            toValue: currentState.scrolling ? 0 : 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [currentState.scrolling]);

    useEffect(() => {
        if (isVisible) {
            setIsSurveyActive(true);
        }
    }, [isVisible]);

    useEffect(() => {
        if (isVisible && scrollState?.current?.slides.length === 0) {
            viewNextSlide(0);
        } else if (!isVisible) {
            resetState();
        }
    }, [isVisible]);

    useEffect(() => {
        if (currentState.currentIndex > -1) {
            scrollViewScrollTo(scrollState?.current?.currentIndex);
        }
    }, [currentState.currentIndex]);

    const viewNextSlide = (newIndex: number) => {
        if (!survey) {
            return;
        }

        setCurrentState({
            ...currentState,
            scrolling: true,
        });

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

            scrollState.current = {
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

            setCurrentState({
                ...currentState,
                currentIndex: newIndex,
                scrolling: true,
            });

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
                    setCurrentState({
                        ...currentState,
                        scrolling: false,
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

        scrollState.current = {
            slides: slides,
            currentIndex: newIndex,
            currentSlide: nextSlide,
            showNext:
                SHOW_NEXT_TYPES.indexOf(nextSlide?.type as SlideType) > -1,
            prevSlides: updatedPrevSlides,
        };

        // trigger a re-render
        setCurrentState({
            ...currentState,
            currentIndex: newIndex,
            scrolling: true,
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
                    onHeightLayout={height => {
                        handleSlideHeightChange(
                            height + 24,
                            newIndex.toString(),
                        );
                    }}
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
                    slide={nextSlideCopy as any}
                    theme={survey.theme}
                    isFreePlan={props.companyPlan === 'free'}
                    onHeightLayout={height => {
                        handleSlideHeightChange(height, newIndex.toString());
                    }}
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

    const onPanelDoneClosing = () => {
        setIsSurveyActive(false);
    };

    const resetState = () => {
        scrollState.current = { slides: [], currentIndex: 0, showNext: false };
        slideHeights.current = {};
        setCurrentState({
            currentIndex: -1,
            slideHeights: {},
            completed: false,
            scrolling: true,
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
            setCurrentState({
                ...currentState,
                currentIndex: scrollState?.current?.currentIndex,
                scrolling: false,
            });
        }

        setCurrentState({
            ...currentState,
            scrolling: false,
        });
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

        setIsNew(false);
        viewNextSlide(scrollState?.current?.currentIndex + 1);
    };

    const prevPress = () => {
        viewNextSlide(scrollState?.current?.currentIndex - 1);
    };

    const handleSlideHeightChange = (height: number, slideIndex: string) => {
        const newSlideHeights: any = { ...slideHeights.current };
        newSlideHeights[slideIndex] = height > 0 ? height : 100;
        slideHeights.current = newSlideHeights;

        setCurrentState(prevState => ({
            ...prevState,
            slideHeights: newSlideHeights,
        }));
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

    if (!survey || !isSurveyActive) {
        return null;
    }

    return (
        <SurveyPanel
            backgroundColor={backgroundColor}
            isVisible={!!isVisible}
            onDoneClosing={onPanelDoneClosing}
        >
            <SurveyHeading theme={survey?.theme} onClose={onClose} />

            <DynamicHeightView
                height={
                    !isVisible
                        ? 0
                        : slideHeights.current[
                              `${scrollState?.current?.currentIndex}`
                          ] || 100
                }
                delay={
                    (scrollState?.current?.currentIndex === 0 && isNew) ||
                    !isVisible
                        ? 0
                        : 300
                }
            >
                <Animated.ScrollView
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
                    {scrollState?.current?.slides}
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
