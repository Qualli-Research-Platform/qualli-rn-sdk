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
    type OutroSlide,
    SlideType,
    TextSlide,
    SurveyTheme,
} from './../../../types';
import Button from '../../components/button/button';
import styles from '../../survey.style';

import SurveySlideInput from '../../components/input/inputs';
import SurveySlideSelect from '../../components/select/select';
import SurveySlideStar from '../../components/star/star';
import SurveySlideNumeric from '../../components/numeric/numeric';
import { DIRECT_ANWER_TYPES } from '../../../config/slide.config';

interface Props {
    index: string;
    slide:
        | InputSlide
        | MultipleChoiceSlide
        | StarSlide
        | NumericSlide
        | NPSSlide
        | TextSlide
        | OutroSlide;
    theme: SurveyTheme;
    isFreePlan: boolean;
    onHeightLayout: (height: number, index: string) => void;
    onAnswerChange: (answer: any) => void;
    onPrevious?: () => void;
    onNext: (saveAnswer?: boolean) => void;
}

const SurveySlide = (props: Props) => {
    const {
        index,
        slide,
        theme,
        onHeightLayout,
        onAnswerChange,
        onPrevious,
        onNext,
        isFreePlan,
    } = props;

    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        // set height on panel
        onHeightLayout(contentHeight, index);
    }, [contentHeight]);

    if (!slide) {
        return null;
    }

    const { title, subtitle, type } = slide;

    const handleLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        setContentHeight(height);
    };

    const renderSlideInputs = () => {
        switch (type) {
            case 'input':
                return (
                    <SurveySlideInput
                        theme={theme}
                        placeholder={slide?.placeholder}
                        onChange={(val: string) => onAnswerChange(val)}
                        multiline={!!slide?.multiline}
                    />
                );
            case 'multiplechoice':
                return (
                    <SurveySlideSelect
                        theme={theme}
                        options={slide.options}
                        multiple={!!slide.multiple}
                        onChange={(val: any[]) => onAnswerChange(val)}
                        onSubmit={onNext}
                    />
                );
            case 'star':
                return (
                    <SurveySlideStar
                        theme={theme}
                        onChange={(val: number) => onAnswerChange(val)}
                    />
                );
            case 'numeric':
                return (
                    <SurveySlideNumeric
                        theme={theme}
                        min={slide?.min || 0}
                        max={slide?.max || 5}
                        onChange={(val: number) => onAnswerChange(val)}
                    />
                );
            case 'nps':
                return (
                    <SurveySlideNumeric
                        theme={theme}
                        min={0}
                        max={10}
                        onChange={(val: number) => onAnswerChange(val)}
                    />
                );
        }
    };

    const showCTA = !!(onNext || onPrevious);
    const centerText = type === SlideType.text || type === SlideType.outro;
    const isTextOrOutro = type === SlideType.text || type === SlideType.outro;

    return (
        <View
            onLayout={handleLayout}
            style={{ paddingBottom: !isFreePlan ? 20 : 0 }}
        >
            <View
                style={[
                    styles.base.headerContainer,
                    isTextOrOutro ? { alignItems: 'center' } : {},
                ]}
            >
                <Text
                    style={[
                        styles.base.title as TextStyle,
                        { color: theme.title_color },
                        type === SlideType.text &&
                            (styles.base.titleCentered as TextStyle),
                        centerText && { textAlign: 'center' },
                    ]}
                >
                    {title}
                </Text>

                {subtitle && (
                    <Text
                        style={[
                            styles.base.subtitle,
                            { color: theme.subtitle_color },
                            type === SlideType.text &&
                                (styles.base.subtitleCentered as TextStyle),
                            centerText && { textAlign: 'center' },
                        ]}
                    >
                        {subtitle}
                    </Text>
                )}
            </View>

            <View style={{ padding: 16, paddingTop: 8 }}>
                {renderSlideInputs()}
            </View>

            {!!onNext && isTextOrOutro && (
                <View style={styles.slide.CTAContainerText as ViewStyle}>
                    <Button
                        onClick={onNext}
                        disabled={false}
                        bgColor={theme.button_color}
                        textColor={theme.button_text_color}
                        cta={slide.button_label || 'Next'}
                    />
                </View>
            )}

            {showCTA && (
                <View style={styles.slide.CTAContainer as ViewStyle}>
                    {onPrevious ? (
                        <TouchableOpacity onPress={onPrevious}>
                            <Image
                                style={[{ tintColor: theme.title_color }]}
                                source={require('./../../../assets/icons/arrow-left.png')}
                            />
                        </TouchableOpacity>
                    ) : (
                        <View />
                    )}

                    {!!onNext &&
                        !isTextOrOutro &&
                        !DIRECT_ANWER_TYPES.includes(type) &&
                        !(
                            type === SlideType.multiplechoice && !slide.multiple
                        ) && (
                            <Button
                                onClick={onNext}
                                disabled={false}
                                bgColor={theme.button_color}
                                textColor={theme.button_text_color}
                                cta={slide.button_label || 'Next'}
                            />
                        )}
                </View>
            )}
        </View>
    );
};

export default SurveySlide;
