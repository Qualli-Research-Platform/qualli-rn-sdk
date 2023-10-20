import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from '../../survey.style';

interface Props {
    cta: string;
    onClick: () => void;
    colorScheme: 'light' | 'dark';
    underline?: boolean;
    disabled: boolean;
    style?: any;
}

const Button = (props: Props) => {
    const { cta, onClick, colorScheme, underline, disabled, style } = props;

    let buttonStyles = [
        styles.base.button.full,
        colorScheme === 'dark' ? styles.base.button.fullDark : null,
        disabled ? styles.base.button.disabled : null,
        style,
    ];

    const labelStyles = [
        styles.base.button.label,
        colorScheme === 'light' ? styles.base.button.labelDark : null,
        underline ? styles.base.button.labelUnderline : null,
    ];

    if (underline) {
        buttonStyles = [
            styles.base.button.underline,
            disabled ? styles.base.button.disabled : null,
            style,
        ];

        if (colorScheme === 'dark') {
            labelStyles.push(styles.base.button.labelUnderlineDark);
        }
    }

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onClick}
            disabled={disabled}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
            <Text style={labelStyles}>{cta}</Text>
        </TouchableOpacity>
    );
};

export default Button;
