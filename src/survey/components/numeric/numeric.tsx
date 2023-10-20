import React, { useState } from 'react';
import { TouchableOpacity, Text, View, ViewStyle } from 'react-native';
import styles from '../../survey.style';

interface Props {
    min: number;
    max: number;
    onChange: (val: number) => void;
    colorScheme: 'light' | 'dark';
}

const SurveySlideNumeric = (props: Props) => {
    const { onChange, colorScheme, min, max } = props;

    const [value, setValue] = useState<number | null>(null);

    const renderButton = (option: number, index: number) => {
        const isSelected = value === option;

        const buttonStyles = [
            styles.form.numeric.button,
            colorScheme === 'dark' ? styles.form.numeric.buttonDark : null,
            colorScheme === 'dark' ? styles.form.numeric.buttonNPS : null,
            isSelected
                ? colorScheme === 'dark'
                    ? styles.form.numeric.buttonSelectedDark
                    : styles.form.numeric.buttonSelected
                : null,
        ];

        const labelStyles = [
            styles.form.numeric.label,
            colorScheme === 'dark' ? styles.form.numeric.labelDark : null,
            isSelected
                ? colorScheme === 'dark'
                    ? styles.form.numeric.labelSelectedDark
                    : styles.form.numeric.labelSelected
                : null,
        ];

        return (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    setValue(option);
                    onChange(option);
                }}
                style={buttonStyles}
            >
                <Text style={labelStyles}>{option}</Text>
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
