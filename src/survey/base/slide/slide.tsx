import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    LayoutChangeEvent,
} from 'react-native';

import type {
    InputSlide,
    SelectSlide,
    MultipleChoiceSlide,
    StarSlide,
    NumericSlide,
    NPSSlide,
} from './../../../types';
import styles from '../../survey.style';

import SurveySlideInput from '../../components/input/inputs';
import SurveySlideSelect from '../../components/select/select';
import SurveySlideStar from '../../components/star/star';
import SurveySlideNumeric from '../../components/numeric/numeric';
import Button from '../../components/button/button';

interface Props {
    slide:
        | InputSlide
        | SelectSlide
        | MultipleChoiceSlide
        | StarSlide
        | NumericSlide
        | NPSSlide;
    colorScheme: 'light' | 'dark';
    onHeightLayout: (height: number) => void;
    onAnswerChange: (answer: any) => void;
    onPrevious?: () => void;
    onNext?: () => void;
}

const SurveySlide = (props: Props) => {
    const {
        slide,
        colorScheme,
        onHeightLayout,
        onAnswerChange,
        onPrevious,
        onNext,
    } = props;

    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        // set height on panel
        onHeightLayout(contentHeight);
    }, [contentHeight]);

    if (!slide) {
        return null;
    }

    const { title, subtitle, type } = slide;

    const handleLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;

        if (contentHeight === 0) {
            setContentHeight(height);
        }
    };

    const renderSlideInputs = () => {
        switch (slide.type) {
            case 'input':
                return (
                    <SurveySlideInput
                        colorScheme={colorScheme}
                        placeholder={slide?.placeholder}
                        onChange={(val: string) => onAnswerChange(val)}
                        multiline={!!slide?.multiline}
                    />
                );
            case 'select':
            case 'multiplechoice':
                return (
                    <SurveySlideSelect
                        colorScheme={colorScheme}
                        options={slide.options}
                        multiple={!!slide.multiple}
                        onChange={(val: any[]) => onAnswerChange(val)}
                    />
                );
            case 'star':
                return (
                    <SurveySlideStar
                        colorScheme={colorScheme}
                        onChange={(val: number) => onAnswerChange(val)}
                    />
                );
            case 'numeric':
                return (
                    <SurveySlideNumeric
                        colorScheme={colorScheme}
                        min={slide?.min || 0}
                        max={slide?.max || 5}
                        onChange={(val: number) => onAnswerChange(val)}
                    />
                );
            case 'nps':
                return (
                    <SurveySlideNumeric
                        colorScheme={colorScheme}
                        min={0}
                        max={10}
                        onChange={(val: number) => onAnswerChange(val)}
                    />
                );
        }
    };

    const _showCTA = onNext || onPrevious;

    return (
        <View onLayout={handleLayout}>
            <View style={styles.base.headerContainer}>
                <Text
                    style={[
                        styles.base.title,
                        colorScheme === 'dark' && styles.base.titleDark,
                    ]}
                >
                    {title}
                </Text>

                {subtitle && (
                    <Text
                        style={[
                            styles.base.subtitle,
                            colorScheme === 'dark' && styles.base.subtitleDark,
                        ]}
                    >
                        {subtitle}
                    </Text>
                )}
            </View>

            <View style={{ padding: 16 }}>{renderSlideInputs()}</View>

            {_showCTA && (
                <View style={styles.slide.CTAContainer}>
                    {onPrevious ? (
                        <TouchableOpacity onPress={onPrevious}>
                            <Image
                                style={[
                                    styles.slide.prevArrow,
                                    colorScheme === 'dark' &&
                                        styles.slide.prevArrowDark,
                                ]}
                                source={require('./../../../assets/icons/arrow-left.png')}
                            />
                        </TouchableOpacity>
                    ) : (
                        <View />
                    )}

                    {!!onNext && (
                        <Button
                            onClick={onNext}
                            disabled={false}
                            colorScheme={colorScheme}
                            cta="Next"
                        />
                    )}
                </View>
            )}
        </View>
    );
};

export default SurveySlide;
