import React from 'react';
import { useState } from 'react';
import { TextInput } from 'react-native';
import styles from './../../survey.style';

interface Props {
    placeholder: string;
    onChange: (val: string) => void;
    multiline: boolean;
    colorScheme: 'light' | 'dark';
}

const SurveySlideInput = (props: Props) => {
    const { onChange, placeholder, multiline, colorScheme } = props;
    const [value, setValue] = useState('');

    return (
        <TextInput
            onChangeText={(val) => {
                setValue(val);
                onChange(val);
            }}
            value={value}
            placeholder={placeholder || 'Type something here'}
            style={[
                styles.form.input.input,
                multiline && styles.form.input.inputMultiline,
                colorScheme === 'dark' ? styles.form.input.inputDark : null,
            ]}
            multiline={multiline}
            placeholderTextColor={
                colorScheme === 'dark'
                    ? styles.form.input.placeholderDark
                    : styles.form.input.placeholder
            }
        ></TextInput>
    );
};

export default SurveySlideInput;
