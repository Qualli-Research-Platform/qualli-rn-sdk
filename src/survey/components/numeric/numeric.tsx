import React, { useEffect } from 'react';
import { useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import styles from './../../survey.style';

interface Props {
    min: number;
    max: number;
    onChange: (val: string) => void;
    colorScheme: 'light' | 'dark';
}

const SurveySlideNumeric = (props: Props) => {
    const { onChange, colorScheme, min, max } = props;

    const [value, setValue] = useState<number>(0);

    useEffect(() => {
        onChange(value.toString());
    }, [value]);

    const renderButton = (option: number, index: number) => {
        const isSelected = value === option;

        let buttonStyles = [
            styles.form.numeric.button,
            colorScheme === 'dark' ? styles.form.numeric.buttonDark : null,
            colorScheme === 'dark' ? styles.form.numeric.buttonNPS : null,
            isSelected
                ? colorScheme === 'dark'
                    ? styles.form.numeric.buttonSelectedDark
                    : styles.form.numeric.buttonSelected
                : null,
        ];

        let labelStyles = [
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
                }}
                style={buttonStyles}
            >
                <Text style={labelStyles}>{option}</Text>
            </TouchableOpacity>
        );
    };

    let buttons = [];
    for (let i = min; i <= max; i++) {
        buttons.push(renderButton(i, i));
    }

    return <View style={styles.form.numeric.wrapper}>{buttons}</View>;
};

export default SurveySlideNumeric;
