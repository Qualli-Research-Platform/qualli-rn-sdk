import React, { useState } from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { SurveyTheme } from './../../../types';
import getContrastingColorForRGB from './../../..//helpers/getContrastingColorForRGB';
import hexToRgb from './../../../helpers/hexToRGB';
import styles from '../../survey.style';

interface Props {
    min: number;
    max: number;
    onChange: (val: number) => void;
    theme: SurveyTheme;
}

const SurveySlideNumeric = (props: Props) => {
    const { onChange, theme, min, max } = props;

    const [value, setValue] = useState<number | null>(null);

    const renderButton = (option: number, index: number) => {
        const isSelected = value === option;

        const buttonStyles = [
            styles.form.numeric.button,
            {
                borderColor: theme.answer_color,
                backgroundColor: isSelected
                    ? theme.answer_color
                    : theme.answer_color + '10',
            },
        ];

        const labelStyles = [
            styles.form.numeric.label,
            {
                color: isSelected
                    ? getContrastingColorForRGB(hexToRgb(theme.answer_color))
                    : theme.answer_color,
            },
        ];

        return (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    setValue(option);
                    onChange(option);
                }}
                style={buttonStyles as ViewStyle}
            >
                <Text style={labelStyles as TextStyle}>{option}</Text>
            </TouchableOpacity>
        );
    };

    const buttons = [];
    for (let i = min; i <= max; i++) {
        buttons.push(renderButton(i, i));
    }

    return (
        <View style={styles.form.numeric.wrapper as ViewStyle}>{buttons}</View>
    );
};

export default SurveySlideNumeric;
