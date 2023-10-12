import React from 'react';
import { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    Keyboard,
    TouchableOpacity,
    Image,
} from 'react-native';

import { type Survey as SurveyType } from './../types';
import { SlideType } from './../types';
import type { Slide } from '../types/survey';

import SurveyPanel from './base/panel/panel';
import SurveySlide from './base/slide/slide';
import SurveyHeading from './base/heading/heading';
import Button from './components/button/button';
import DynamicHeightView from '../common/dynamicHeightView';

import colors from '../styles/colors';

interface Props {
    survey: SurveyType;
    isVisible?: boolean;
    onComplete: (answers: any) => void;
    onAbortSurvey: (answers: any) => void;
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
    const [currentState, setCurrentState] = useState({
        currentIndex: -1,
        slideHeights: {},
    });
    const [isNew, setIsNew] = useState(true);
    const [answers, setAnswers] = useState<any[]>([]);
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

    const { survey, isVisible, onComplete, onAbortSurvey } = props;

    useEffect(() => {
        if (isVisible && scrollState?.current?.slides.length === 0) {
            viewNextSlide(0);
        }
    }, [isVisible]);

    useEffect(() => {
        if (currentState.currentIndex > -1)
            scrollViewScrollTo(scrollState?.current?.currentIndex);
    }, [currentState.currentIndex]);

    const viewNextSlide = (newIndex: number, givenAnswers?: any) => {
        // if we went forward in our index -> add in the next slide
        // if we went back in our index -> keep the last slide for now
        let renderUntilIndex = scrollState?.current?.currentIndex;

        if (newIndex > scrollState?.current?.currentIndex) {
            renderUntilIndex = newIndex;
        }

        // did we reach the end?
        if (newIndex > survey.slides.length - 1) {
            onComplete(givenAnswers || answers);
        }

        const newSlides = [];
        for (let i = 0; i < renderUntilIndex + 1; i++) {
            newSlides.push(
                <ScrollView
                    scrollEnabled={false}
                    key={i}
                    style={[
                        styles.slide,
                        {
                            width: Dimensions.get('window').width,
                        },
                    ]}
                >
                    <SurveySlide
                        slide={survey.slides[i]}
                        colorScheme={colorScheme}
                        onHeightLayout={(height) => {
                            handleSlideHeightChange(
                                height,
                                survey.slides[i]?.id
                            );
                        }}
                        onAnswerChange={(val) => onSlideAnswerChange(i, val)}
                    />
                </ScrollView>
            );
        }

        scrollState.current = {
            slides: newSlides,
            currentIndex: newIndex,
            currentSlide: survey.slides[newIndex],
            showNext:
                SHOW_NEXT_TYPES.indexOf(survey.slides[newIndex]?.type) > -1,
        };
        // trigger a re-render
        setCurrentState({ ...currentState, currentIndex: newIndex });
    };

    const onPanelClose = () => {
        scrollState.current = { slides: [], currentIndex: 0, showNext: false };
        slideHeights.current = {};
        setCurrentState({ currentIndex: -1, slideHeights: {} });
        setIsNew(true);
    };

    const onSlideAnswerChange = (index: number, value: any) => {
        // slides that are text / multiple choice should not automatically progress
        const slide = survey.slides[index];
        const newAnswers = [...answers];
        newAnswers[`${index}`] = value;
        setAnswers(newAnswers);

        if (DIRECT_ANWER_TYPES.indexOf(slide?.type) > -1) {
            viewNextSlide(scrollState?.current?.currentIndex + 1, answers);
        }
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
        newSlideHeights[slideId] = height;
        slideHeights.current = newSlideHeights;

        setCurrentState({ ...currentState, slideHeights: newSlideHeights });
    };

    const colorScheme = survey.style?.colorScheme || 'light';

    return (
        <SurveyPanel
            backgroundColor={survey?.style?.backgroundColor || 'white'}
            isVisible={!!isVisible}
            onClose={onPanelClose}
        >
            <View style={styles.headingWrapper}>
                <SurveyHeading
                    colorScheme={colorScheme}
                    onClose={() => onAbortSurvey(answers)}
                    numberOfSlides={survey?.slides?.length || 1}
                    currentSlideIndex={1}
                />
            </View>

            <DynamicHeightView
                style={styles.innerScrollContainer}
                height={
                    slideHeights.current[
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
                {(scrollState?.current?.currentIndex > 0 ||
                    scrollState?.current?.showNext) && (
                    <View style={styles.CTAContainer}>
                        {scrollState?.current?.currentIndex > 0 ? (
                            <TouchableOpacity onPress={prevPress}>
                                <Image
                                    style={[
                                        styles.prevArrow,
                                        colorScheme === 'dark' &&
                                            styles.prevArrowDark,
                                    ]}
                                    source={require('./../assets/icons/arrow-left.png')}
                                />
                            </TouchableOpacity>
                        ) : (
                            <View />
                        )}

                        {scrollState?.current?.showNext && (
                            <Button
                                onClick={nextPress}
                                disabled={
                                    answers[
                                        `${scrollState?.current?.currentIndex}`
                                    ] === (undefined || '')
                                }
                                colorScheme={colorScheme}
                                cta="Next"
                            />
                        )}
                    </View>
                )}
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
    CTAContainer: {
        padding: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'absolute',
        width: '100%',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
    },
    previousButton: {
        marginRight: 16,
    },
    innerScrollContainer: {
        width: '100%',
    },
    slide: {
        width: Dimensions.get('window').width,
    },
    prevArrow: {
        tintColor: 'white',
    },
    prevArrowDark: {
        tintColor: colors.darkestGrey,
    },
});

export default Survey;
