import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import type {
    InputSlide,
    SelectSlide,
    MultipleChoiceSlide,
    StarSlide,
    NumericSlide,
    NPSSlide,
    CSATSlide,
} from '../../../types';
import styles from './../../survey.style';

import SurveySlideInput from '../../components/input/inputs';
import SurveySlideSelect from '../../components/select/select';
import SurveySlideStar from '../../components/star/star';
import SurveySlideNumeric from '../../components/numeric/numeric';

interface Props {
    slide:
        | InputSlide
        | SelectSlide
        | MultipleChoiceSlide
        | StarSlide
        | NumericSlide
        | NPSSlide
        | CSATSlide;
    colorScheme: 'light' | 'dark';
    onHeightLayout: (height: number) => void;
}

const SurveySlide = (props: Props) => {
    const { slide, colorScheme, onHeightLayout } = props;

    const [value, setValue] = useState('');
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        // set height on panel
        onHeightLayout(contentHeight);
    }, [contentHeight]);

    if (!slide) return null;

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
                        onChange={(val: string) => setValue(val)}
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
                        onChange={(val: string[]) => console.log(val)}
                    />
                );
            case 'star':
                return (
                    <SurveySlideStar
                        colorScheme={colorScheme}
                        onChange={(val: string) => console.log(val)}
                    />
                );
            case 'numeric':
                return (
                    <SurveySlideNumeric
                        colorScheme={colorScheme}
                        min={slide?.min || 0}
                        max={slide?.max || 5}
                        onChange={(val: string) => console.log(val)}
                    />
                );
            case 'nps':
                return (
                    <SurveySlideNumeric
                        colorScheme={colorScheme}
                        min={0}
                        max={10}
                        onChange={(val: string) => console.log(val)}
                    />
                );
            // case 'csat':
            //     return (
            //     <SurveySlideCSAT
            //         onChange={(val: string) => console.log(val)}
            //     />
            //     );
        }
    };

    return (
        <View style={{ padding: 16 }} onLayout={handleLayout}>
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

            {renderSlideInputs()}
        </View>
    );
};

export default SurveySlide;
