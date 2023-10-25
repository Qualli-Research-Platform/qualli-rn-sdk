import React, { useState } from 'react';
import {
    TouchableOpacity,
    Text,
    ScrollView,
    Image,
    View,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { SurveyTheme } from './../../../types';
import styles from '../../survey.style';

interface Props {
    options: { label: string }[];
    onChange: (val: string[]) => void;
    multiple: boolean;
    theme: SurveyTheme;
}

const SurveySlideSelect = (props: Props) => {
    const { options, onChange, multiple, theme } = props;

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
                    styles.form.select.button as ViewStyle,
                    index > 0 && { marginTop: 12 },
                    {
                        backgroundColor: theme.answer_color + '10',
                        borderColor: theme.answer_color,
                    },
                ]}
            >
                {isSelected && (
                    <View
                        style={[
                            styles.form.select.borderCollapse as ViewStyle,
                            { borderColor: theme.answer_color },
                        ]}
                    />
                )}
                <View style={styles.form.select.labelWrapper as ViewStyle}>
                    <Text
                        style={
                            [
                                styles.form.select.label,
                                { color: theme.answer_color },
                            ] as TextStyle
                        }
                    >
                        {option}
                    </Text>
                    {isSelected && (
                        <Image
                            source={require('../../../assets/icons/check.png')}
                            style={styles.form.select.icon}
                            tintColor={theme.answer_color}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const buttons = options.map((option, index) => {
        return renderButton(option.label, index);
    });

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 300 }}
        >
            {buttons}
        </ScrollView>
    );
};

export default SurveySlideSelect;
