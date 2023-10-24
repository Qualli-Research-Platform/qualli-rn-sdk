import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    LayoutChangeEvent,
    ViewStyle,
    TextStyle,
} from 'react-native';

import {
    type InputSlide,
    type MultipleChoiceSlide,
    type StarSlide,
    type NumericSlide,
    type NPSSlide,
    SlideType,
    TextSlide,
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
        | MultipleChoiceSlide
        | StarSlide
        | NumericSlide
        | NPSSlide
        | TextSlide;
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
        switch (type) {
            case 'input':
                return (
                    <SurveySlideInput
                        colorScheme={colorScheme}
                        placeholder={slide?.placeholder}
                        onChange={(val: string) => onAnswerChange(val)}
                        multiline={!!slide?.multiline}
                    />
                );
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
                        type === SlideType.text &&
                            (styles.base.titleCentered as TextStyle),
                    ]}
                >
                    {title}
                </Text>

                {subtitle && (
                    <Text
                        style={[
                            styles.base.subtitle,
                            colorScheme === 'dark' && styles.base.subtitleDark,
                            type === SlideType.text &&
                                (styles.base.subtitleCentered as TextStyle),
                        ]}
                    >
                        {subtitle}
                    </Text>
                )}
            </View>

            <View style={{ padding: 16, paddingTop: 8 }}>
                {renderSlideInputs()}
            </View>

            {!!onNext && type === SlideType.text && (
                <View style={styles.slide.CTAContainerText as ViewStyle}>
                    <Button
                        onClick={onNext}
                        disabled={false}
                        colorScheme={colorScheme}
                        cta={slide.button_label || 'Next'}
                    />
                </View>
            )}

            {_showCTA && (
                <View style={styles.slide.CTAContainer as ViewStyle}>
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

                    {!!onNext && type !== SlideType.text && (
                        <Button
                            onClick={onNext}
                            disabled={false}
                            colorScheme={colorScheme}
                            cta={slide.button_label || 'Next'}
                        />
                    )}
                </View>
            )}
        </View>
    );
};

export default SurveySlide;
