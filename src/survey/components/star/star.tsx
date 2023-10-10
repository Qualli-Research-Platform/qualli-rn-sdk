import React from 'react';
import { useState } from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import styles from './../../survey.style';

interface Props {
    onChange: (val: string) => void;
    colorScheme: 'light' | 'dark';
}

const SurveySlideStar = (props: Props) => {
    const { onChange, colorScheme } = props;

    const [value, setValue] = useState<number>(0);

    const renderButton = (option: number, index: number) => {
        const isSelected = value >= index + 1;

        return (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    setValue(index + 1);
                }}
                style={[styles.form.star.button]}
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
                        colorScheme === 'dark'
                            ? styles.form.star.iconDark
                            : null,
                        isSelected
                            ? colorScheme === 'dark'
                                ? styles.form.star.iconDarkSelected
                                : styles.form.star.iconSelected
                            : null,
                    ]}
                />
            </TouchableOpacity>
        );
    };

    const buttons = [1, 2, 3, 4, 5].map((option, index) => {
        return renderButton(option, index);
    });

    return <View style={styles.form.star.wrapper}>{buttons}</View>;
};

export default SurveySlideStar;
