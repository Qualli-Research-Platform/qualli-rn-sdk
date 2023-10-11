import React from 'react';
import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';

import { type Survey as SurveyType } from './../types';
import SurveyBackdrop from './base/backdrop/backdrop';
import SurveyPanel from './base/panel/panel';
import SurveySlide from './base/slide/slide';
import SurveyHeading from './base/heading/heading';
import Button from './components/button/button';
import DynamicHeightView from '../common/dynamicHeightView';

interface Props {
    forceOpenInt: number;
    survey: SurveyType;
}

const Survey = (props: Props) => {
    const [isVisible, setIsVisible] = useState(false);
    const [slideHeights, setSlideHeights] = useState<number[]>([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(-1);
    const [currentSlideIndexBeforeRender, setCurrentSlideIndexBeforeRender] =
        useState(-1);
    const [scrollState, setScrollState] = useState<{
        slides: JSX.Element[];
        currentIndex: number;
    }>({ slides: [], currentIndex: 0 });
    const slidesScrollRef = React.useRef(null);

    const { survey } = props;

    useEffect(() => {
        if (props.forceOpenInt > 0) {
            setIsVisible(true);
        }
    }, [props.forceOpenInt]);

    useEffect(() => {
        if (!isVisible) {
            setScrollState({ slides: [], currentIndex: 0 });
            setSlideHeights([]);
            setCurrentSlideIndex(-1);
            setCurrentSlideIndexBeforeRender(-1);
        } else {
            setCurrentSlideIndexBeforeRender(0);
        }
    }, [isVisible]);

    useEffect(() => {
        // if we went forward in our index -> add in the next slide
        // if we went back in our index -> keep the last slide for now
        let maxIndexSlide = scrollState.currentIndex;
        if (currentSlideIndexBeforeRender > maxIndexSlide) {
            maxIndexSlide = currentSlideIndexBeforeRender;
        }

        const newSlides = [];
        for (let i = 0; i < maxIndexSlide + 1; i++) {
            newSlides.push(
                <ScrollView
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
                            handleSlideHeightChange(height, i);
                        }}
                    />
                </ScrollView>
            );
        }

        setScrollState({
            slides: newSlides,
            currentIndex: currentSlideIndexBeforeRender,
        });

        if (newSlides.length - 1 > currentSlideIndexBeforeRender) {
            scrollViewUpdatePosition(currentSlideIndexBeforeRender);
        }
    }, [currentSlideIndexBeforeRender, slideHeights]);

    useEffect(() => {
        if (scrollState.currentIndex === currentSlideIndex) return;
    }, [scrollState]);

    const scrollViewUpdatePosition = (index: number) => {
        slidesScrollRef?.current?.scrollTo({
            x: Dimensions.get('window').width * index,
            y: 0,
            animated: true,
        });
    };
    const cleanupScrollStateOnAnimationEnd = () => {
        if (scrollState.currentIndex < scrollState?.slides.length - 1) {
            setScrollState({
                slides: scrollState.slides.slice(
                    0,
                    scrollState.currentIndex + 1
                ),
                currentIndex: scrollState.currentIndex,
            });
        }
    };

    const handleSlideHeightChange = (
        height: number,
        activeSlideIndex: number
    ) => {
        const newSlideHeights = [...slideHeights];
        newSlideHeights[`${activeSlideIndex}`] = height;
        setSlideHeights(newSlideHeights);
    };

    const colorScheme = survey.style?.colorScheme || 'light';

    return (
        <View
            style={styles.container}
            pointerEvents={!isVisible ? 'none' : 'auto'}
        >
            <SurveyBackdrop
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
            >
                <SurveyPanel
                    backgroundColor={survey?.style?.backgroundColor || 'white'}
                    isVisible={isVisible}
                >
                    <View style={styles.headingWrapper}>
                        <SurveyHeading
                            colorScheme={colorScheme}
                            onClose={() => setIsVisible(false)}
                            numberOfSlides={survey?.slides?.length || 1}
                            currentSlideIndex={1}
                        />
                    </View>

                    <DynamicHeightView
                        style={styles.innerScrollContainer}
                        height={
                            slideHeights[`${scrollState.currentIndex}`] || 0
                        }
                    >
                        <ScrollView
                            style={[]}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={__DEV__}
                            ref={slidesScrollRef}
                            onMomentumScrollEnd={
                                cleanupScrollStateOnAnimationEnd
                            }
                            onContentSizeChange={() =>
                                scrollViewUpdatePosition(
                                    scrollState.currentIndex
                                )
                            }
                        >
                            {scrollState.slides}
                        </ScrollView>
                    </DynamicHeightView>

                    <View style={styles.CTAContainer}>
                        {scrollState.currentIndex > 0 ? (
                            <Button
                                style={styles.previousButton}
                                onClick={() => {
                                    setCurrentSlideIndexBeforeRender(
                                        scrollState.currentIndex - 1
                                    );
                                }}
                                disabled={false}
                                colorScheme={colorScheme}
                                cta="Previous"
                                underline
                            />
                        ) : (
                            <View />
                        )}

                        {scrollState.currentIndex <
                            survey.slides.length - 1 && (
                            <Button
                                onClick={() => {
                                    setCurrentSlideIndexBeforeRender(
                                        scrollState.currentIndex + 1
                                    );
                                }}
                                disabled={false}
                                colorScheme={colorScheme}
                                cta="Next"
                            />
                        )}
                    </View>
                </SurveyPanel>
            </SurveyBackdrop>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 99,
    },
    headingWrapper: {
        padding: 16,
    },
    CTAContainer: {
        padding: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    previousButton: {
        marginRight: 16,
    },
    innerScrollContainer: {
        width: '100%',
    },
    slide: {
        width: Dimensions.get('window').width,
        // padding: 16,
    },
});

export default Survey;
