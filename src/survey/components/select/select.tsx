import React, { useState } from 'react';
import { TouchableOpacity, Text, ScrollView } from 'react-native';
import styles from '../../survey.style';

interface Props {
    options: { label: string }[];
    onChange: (val: string[]) => void;
    multiple: boolean;
    colorScheme: 'light' | 'dark';
}

const SurveySlideSelect = (props: Props) => {
    const { options, onChange, multiple, colorScheme } = props;

    const [values, setValues] = useState<string[]>([]);

    const renderButton = (option: string, index: number) => {
        const isSelected = values.includes(option);

        return (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    if (multiple) {
                        let vals = [];

                        if (isSelected) {
                            vals = values.filter(
                                (val: string) => val !== option,
                            );
                        } else {
                            vals = [...values, option];
                        }
                        setValues(vals);
                        onChange(vals);
                    } else {
                        setValues([option]);
                        onChange([option]);
                    }
                }}
                style={[
                    styles.form.select.button,
                    index > 0 && { marginTop: 12 },
                    colorScheme === 'dark'
                        ? styles.form.select.buttonDark
                        : null,
                    isSelected
                        ? colorScheme === 'dark'
                            ? styles.form.select.buttonDarkSelected
                            : styles.form.select.buttonSelected
                        : null,
                ]}
            >
                <Text
                    style={[
                        styles.form.select.label,
                        colorScheme === 'dark'
                            ? styles.form.select.labelDark
                            : null,
                        isSelected
                            ? colorScheme === 'dark'
                                ? styles.form.select.labelDarkSelected
                                : styles.form.select.labelSelected
                            : null,
                    ]}
                >
                    {option}
                </Text>
            </TouchableOpacity>
        );
    };

    const buttons = options.map((option, index) => {
        return renderButton(option.label, index);
    });

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 400 }}
        >
            {buttons}
        </ScrollView>
    );
};

export default SurveySlideSelect;
