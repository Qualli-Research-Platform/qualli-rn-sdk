import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SurveyTheme } from '../../../types';

interface Props {
    theme: SurveyTheme;
    onClose: () => void;
}

const SurveyHeading = (props: Props) => {
    const { theme, onClose } = props;

    return (
        <TouchableOpacity
            style={styles.closeIcon}
            onPress={onClose}
            hitSlop={20}
        >
            <Image
                source={require('./../../../assets/icons/cross.png')}
                tintColor={theme.title_color}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    closeIcon: {
        width: 16,
        position: 'absolute',
        right: 16,
        top: 24,
        zIndex: 1,
    },
});

export default SurveyHeading;
