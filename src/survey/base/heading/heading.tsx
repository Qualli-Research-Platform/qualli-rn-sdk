import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native';
import { SurveyTheme } from '../../../types';

interface Props {
    companyPlan: string;
    theme: SurveyTheme;
    onClose: () => void;
}

const SurveyHeading = (props: Props) => {
    const { theme, onClose, companyPlan } = props;

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                {companyPlan === 'free' && (
                    <View
                        style={{
                            backgroundColor: theme.button_color,
                            borderRadius: 12,
                            fontSize: 12,
                            paddingHorizontal: 14,
                            paddingVertical: 8,
                        }}
                    >
                        <Text
                            style={{
                                color: theme.button_text_color,
                            }}
                        >
                            Powered by Qualli
                        </Text>
                    </View>
                )}
            </View>

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
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    closeIcon: {
        width: 16,
    },
    branding: {
        textDecorationLine: 'underline',
    },
});

export default SurveyHeading;
