import React, { useState } from 'react';
import { TouchableOpacity, View, Image, ViewStyle } from 'react-native';
import { SurveyTheme } from './../../../types';
import styles from '../../survey.style';

interface Props {
    onChange: (val: number) => void;
    theme: SurveyTheme;
}

const SurveySlideStar = (props: Props) => {
    const { onChange, theme } = props;

    const [value, setValue] = useState<number>(0);

    const renderButton = (option: number, index: number) => {
        const isSelected = value >= option;

        return (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    setValue(option);
                    onChange(option);
                }}
                style={[styles.form.star.button as ViewStyle]}
            >
                <Image
                    resizeMode="contain"
                    source={
                        isSelected
                            ? require('../../../assets/icons/star-outline-selected.png')
                            : require('../../../assets/icons/star-outline-not-selected.png')
                    }
                    style={[
                        styles.form.star.icon,
                        { tintColor: theme.answer_color },
                    ]}
                />
            </TouchableOpacity>
        );
    };

    const buttons = [1, 2, 3, 4, 5].map((option, index) => {
        return renderButton(option, index);
    });

    return <View style={styles.form.star.wrapper as ViewStyle}>{buttons}</View>;
};

export default SurveySlideStar;
