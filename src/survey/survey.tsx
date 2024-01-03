import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    Keyboard,
} from 'react-native';

import { type Survey as SurveyType, SlideType, Slide } from './../types';

import DynamicHeightView from './../common/dynamicHeightView';
import SurveyPanel from './base/panel/panel';
import SurveySlide from './base/slide/slide';
import SurveyHeading from './base/heading/heading';

interface Props {
    survey?: SurveyType;
    isVisible?: boolean;
    answers: { [key: string]: any };
    companyPlan: string;
    onComplete: () => void;
    onClose: () => void;
    onAnswer: (slideId: string, answer: any) => void;
    closeSurvey: () => void;
}

export const SHOW_NEXT_TYPES: SlideType[] = [
    SlideType.input,
    SlideType.multiplechoice,
    SlideType.input,
];

export const DIRECT_ANWER_TYPES: SlideType[] = [
    SlideType.star,
    SlideType.nps,
    SlideType.numeric,
    SlideType.text,
];

const Survey = (props: Props) => {
    const { survey, isVisible, onComplete, onClose, onAnswer, closeSurvey } =
        props;
    const backgroundColor = survey?.theme.background_color;

    const [currentState, setCurrentState] = useState({
        currentIndex: -1,
        slideHeights: {},
        completed: false,
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
        showNext: boolean;
    }>({
        slides: [],
        currentIndex: 0,
        showNext: false,
        currentSlide: undefined,
    });

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

    useEffect(() => {
        if (currentState.completed) {
            onComplete();
            closeSurvey();
        }
    }, [currentState.completed]);

    const viewNextSlide = (newIndex: number) => {
        if (!survey) {
            return;
        }

        const slides = [...scrollState.current.slides];

        if (
            !!survey?.outro &&
            survey?.slides.length &&
            newIndex > survey.slides.length - 1
        ) {
            slides.push(
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
                                survey?.outro?.title ||
                                'Thank you for your time!',
                            subtitle:
                                survey?.outro?.subtitle ||
                                'We appreciate your feedback.',
                            button_label: survey?.outro?.button_label || 'Done',
                        }}
                        theme={survey.theme}
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
        }

        // did we reach the end?
        if (
            survey?.slides &&
            ((survey?.outro && newIndex > survey.slides.length) ||
                (!survey?.outro && newIndex > survey.slides.length - 1))
        ) {
            setCurrentState({ ...currentState, completed: true });
            return;
        }

        // only when going forward
        if (
            newIndex > scrollState?.current?.currentIndex ||
            (newIndex === 0 && scrollState?.current?.slides.length === 0)
        ) {
            slides.push(
                <ScrollView
                    scrollEnabled={false}
                    key={newIndex}
                    style={[
                        {
                            width: Dimensions.get('window').width,
                        },
                    ]}
                >
                    <SurveySlide
                        slide={survey.slides[newIndex]}
                        theme={survey.theme}
                        onHeightLayout={height => {
                            handleSlideHeightChange(
                                height,
                                newIndex.toString(),
                            );
                        }}
                        onAnswerChange={val => {
                            onSlideAnswerChange(
                                survey.slides[newIndex]?.unique_identifier,
                                val,
                                survey.slides[newIndex]?.type,
                            );
                        }}
                        onNext={() =>
                            nextPress(
                                SHOW_NEXT_TYPES.includes(
                                    survey.slides[newIndex]?.type,
                                ),
                            )
                        }
                        onPrevious={
                            newIndex > 0 ? () => prevPress() : undefined
                        }
                    />
                </ScrollView>,
            );
        }

        scrollState.current = {
            slides: slides,
            currentIndex: newIndex,
            currentSlide: survey.slides[newIndex],
            showNext:
                SHOW_NEXT_TYPES.indexOf(survey.slides[newIndex]?.type) > -1,
        };

        // trigger a re-render
        setCurrentState({ ...currentState, currentIndex: newIndex });
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
        });
    };

    const scrollViewScrollTo = (index: number) => {
        slidesScrollRef?.current?.scrollTo({
            x: Dimensions.get('window').width * index,
            y: 0,
            animated: true,
        });
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
            });
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

    if (!survey || !isSurveyActive) {
        return null;
    }

    return (
        <SurveyPanel
            backgroundColor={backgroundColor}
            isVisible={!!isVisible}
            onDoneClosing={onPanelDoneClosing}
        >
            <View style={styles.headingWrapper}>
                <SurveyHeading
                    companyPlan={props.companyPlan}
                    theme={survey?.theme}
                    onClose={onClose}
                />
            </View>

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
                <ScrollView
                    style={[]}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                    ref={slidesScrollRef}
                    onMomentumScrollEnd={cleanupScrollStateOnAnimationEnd}
                    onContentSizeChange={() =>
                        scrollViewScrollTo(scrollState?.current?.currentIndex)
                    }
                >
                    {scrollState?.current?.slides}
                </ScrollView>
            </DynamicHeightView>
        </SurveyPanel>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 99,
    },
    headingWrapper: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
});

export default Survey;
