import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native';

interface Props {
    color: string;
    companyPlan: string;
    onClose: () => void;
}

const SurveyHeading = (props: Props) => {
    const { color, onClose, companyPlan } = props;

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                {companyPlan === 'free' && (
                    <Text
                        style={[
                            {
                                color: color,
                            },
                            styles.branding,
                        ]}
                    >
                        {'Powered by Qualli'}
                    </Text>
                )}
            </View>

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
        paddingTop: 8,
        paddingBottom: 16,
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
    branding: {
        textDecorationLine: 'underline',
    },
});

export default SurveyHeading;
