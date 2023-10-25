import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { SurveyTheme } from './../../../types';
import styles from '../../survey.style';

interface Props {
    placeholder: string;
    onChange: (val: string) => void;
    multiline: boolean;
    theme: SurveyTheme;
}

const SurveySlideInput = (props: Props) => {
    const { onChange, placeholder, multiline, theme } = props;
    const { answer_color } = theme;

    const [value, setValue] = useState('');

    useEffect(() => {
        onChange(value);
    }, [value]);

    return (
        <TextInput
            onChangeText={val => {
                setValue(val);
            }}
            value={value}
            placeholder={placeholder || 'Type something here'}
            style={[
                styles.form.input.input,
                multiline && styles.form.input.inputMultiline,
                {
                    color: answer_color,
                    borderColor: answer_color,
                    backgroundColor: answer_color + '10',
                },
            ]}
            multiline={multiline}
            placeholderTextColor={answer_color}
        />
    );
};

export default SurveySlideInput;
