import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';

interface Props {
    color: string;
    onClose: () => void;
}

const SurveyHeading = (props: Props) => {
    const { color, onClose } = props;

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer} />

            <TouchableOpacity
                style={styles.closeIcon}
                onPress={onClose}
                hitSlop={20}
            >
                <Image
                    source={require('./../../../assets/icons/cross.png')}
                    tintColor={color}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 8,
        paddingRight: 0,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    leftContainer: {
        flex: 1,
    },
    closeIcon: {
        width: 16,
    },
});

export default SurveyHeading;
