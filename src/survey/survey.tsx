import React from 'react';
import { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    Keyboard,
} from 'react-native';

import { type Survey as SurveyType } from './../types';
import { SlideType } from './../types';
import type { Slide } from '../types/survey';

import SurveyPanel from './base/panel/panel';
import SurveySlide from './base/slide/slide';
import SurveyHeading from './base/heading/heading';
import DynamicHeightView from '../common/dynamicHeightView';

interface Props {
    survey?: SurveyType;
    isVisible?: boolean;
    answers: { [key: string]: any };
    onComplete: () => void;
    onAbortSurvey: () => void;
    onAnswer: (slideId: string, answer: any) => void;
}

const SHOW_NEXT_TYPES: SlideType[] = [
    SlideType.input,
    SlideType.multiplechoice,
];

const DIRECT_ANWER_TYPES: SlideType[] = [
    SlideType.star,
    SlideType.select,
    SlideType.nps,
    SlideType.numeric,
    // SlideType.csat,
];

const Survey = (props: Props) => {
    const { survey, answers, isVisible, onComplete, onAbortSurvey, onAnswer } =
        props;
    const colorScheme = survey?.style?.colorScheme || 'light';
    const backgroundColor = survey?.style?.backgroundColor || '#000';

    const [currentState, setCurrentState] = useState({
        currentIndex: -1,
        slideHeights: {},
        completed: false,
    });
    const [isNew, setIsNew] = useState(true);
    const [isSurveyActive, setIsSurveyActive] = useState(false);
    const slideHeights = React.useRef<{}>({});
    const slidesScrollRef = React.useRef(null);
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
        if (isVisible) setIsSurveyActive(true);
    }, [isVisible]);

    useEffect(() => {
        if (isVisible && scrollState?.current?.slides.length === 0) {
            viewNextSlide(0);
        } else if (!isVisible) {
            resetState();
        }
    }, [isVisible]);

    useEffect(() => {
        if (currentState.currentIndex > -1)
            scrollViewScrollTo(scrollState?.current?.currentIndex);
    }, [currentState.currentIndex]);

    useEffect(() => {
        if (currentState.completed) {
            onComplete();
        }
    }, [currentState.completed]);

    const viewNextSlide = (newIndex: number) => {
        // if we went forward in our index -> add in the next slide
        // if we went back in our index -> keep the last slide for now

        // did we reach the end?
        if (newIndex > survey.slides.length - 1) {
            setCurrentState({ ...currentState, completed: true });
            return;
        }

        const slides = [...scrollState.current.slides];

        // only when going forward
        if (newIndex > scrollState?.current?.currentIndex || newIndex === 0) {
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
                        colorScheme={colorScheme}
                        onHeightLayout={(height) => {
                            handleSlideHeightChange(
                                height,
                                survey.slides[newIndex]?.id
                            );
                        }}
                        onAnswerChange={(val) => {
                            onSlideAnswerChange(
                                survey.slides[newIndex]?.id,
                                val,
                                survey.slides[newIndex]?.type
                            );
                        }}
                        onNext={
                            SHOW_NEXT_TYPES.indexOf(
                                survey.slides[newIndex]?.type
                            ) > -1
                                ? () => nextPress()
                                : undefined
                        }
                        onPrevious={
                            newIndex > 0 ? () => prevPress() : undefined
                        }
                    />
                </ScrollView>
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
        type: SlideType
    ) => {
        onAnswer(slideId, value);

        if (DIRECT_ANWER_TYPES.indexOf(type) > -1) {
            viewNextSlide(scrollState?.current?.currentIndex + 1);
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
                    scrollState?.current?.currentIndex + 1
                ),
            };
            setCurrentState({
                ...currentState,
                currentIndex: scrollState?.current?.currentIndex,
            });
        }
    };

    const nextPress = () => {
        // check if we're on the last slide already
        if (
            survey?.slides[scrollState?.current?.currentIndex]?.type === 'input'
        ) {
            Keyboard.dismiss();
        }

        setIsNew(false);
        viewNextSlide(scrollState?.current?.currentIndex + 1);
    };

    const prevPress = () => {
        viewNextSlide(scrollState?.current?.currentIndex - 1);
    };

    const handleSlideHeightChange = (height: number, slideId: number) => {
        const newSlideHeights = { ...slideHeights.current };
        newSlideHeights[slideId] = height > 0 ? height : 100;
        slideHeights.current = newSlideHeights;

        setCurrentState((prevState) => ({
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
                    colorScheme={colorScheme}
                    onClose={onAbortSurvey}
                    numberOfSlides={survey?.slides?.length || 1}
                    currentSlideIndex={1}
                />
            </View>

            <DynamicHeightView
                height={
                    !isVisible
                        ? 0
                        : slideHeights.current[
                              `${scrollState?.current?.currentSlide?.id}`
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
