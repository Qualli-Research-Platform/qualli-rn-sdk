import React from 'react';
import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import SurveyBackdrop from './base/backdrop/backdrop';
import SurveyPanel from './base/panel/panel';
import SurveySlide from './base/slide/slide';
import SurveyHeading from './base/heading/heading';
import { type Survey as SurveyType } from './../types';
import Button from './components/button/button';

interface Props {
    forceOpenInt: number;
    survey: SurveyType;
}

const Survey = (props: Props) => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(1);

    const { survey } = props;

    useEffect(() => {
        if (props.forceOpenInt > 0) {
            setIsVisible(true);
        }
    }, [props.forceOpenInt]);

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

                    {survey.slides.map((slide, index) => (
                        <SurveySlide
                            key={index}
                            slide={slide}
                            colorScheme={colorScheme}
                        />
                    ))}

                    <View style={styles.CTAContainer}>
                        <Button
                            style={styles.previousButton}
                            onClick={() => {}}
                            disabled={false}
                            colorScheme={colorScheme}
                            cta="Previous"
                            underline
                        />

                        <Button
                            onClick={() => {}}
                            disabled={false}
                            colorScheme={colorScheme}
                            cta="Next"
                        />
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
    headingWrapper: {},
    CTAContainer: {
        marginTop: 32,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
    },
    previousButton: {
        marginRight: 16,
    },
});

export default Survey;
