import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from '../../survey.style';

interface Props {
    cta: string;
    onClick: () => void;
    bgColor: string;
    textColor: string;
    underline?: boolean;
    disabled: boolean;
    style?: any;
}

const Button = (props: Props) => {
    const { cta, onClick, bgColor, textColor, underline, disabled, style } =
        props;

    let buttonStyles = [
        styles.base.button.full,
        disabled ? styles.base.button.disabled : null,
        { backgroundColor: bgColor },
        style,
    ];

    const labelStyles = [
        styles.base.button.label,
        underline ? styles.base.button.labelUnderline : null,
        { color: textColor },
    ];

    if (underline) {
        buttonStyles = [
            styles.base.button.underline,
            disabled ? styles.base.button.disabled : null,
            style,
        ];
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
