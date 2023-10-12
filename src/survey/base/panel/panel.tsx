import React, { useState, useRef, useEffect } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import {} from 'react-native';
import {
    Animated,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    View,
    Dimensions,
} from 'react-native';

interface Props {
    isVisible: boolean;
    backgroundColor?: string;
    children: React.ReactNode;
    onClose: () => void;
}

const SurveyPanel = (props: Props) => {
    const { isVisible, children, backgroundColor, onClose } = props;

    const [contentHeight, setContentHeight] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const slideAnim = useRef(
        new Animated.Value(Dimensions.get('screen').height)
    ).current;

    const handleLayout = (event: LayoutChangeEvent) => {
        let { height } = event.nativeEvent.layout;
        height = Math.ceil(height);

        if (contentHeight !== height && isVisible) {
            setContentHeight(height);
        }
    };

    useEffect(() => {
        if (isVisible) setIsActive(true);

        if (contentHeight && isVisible) {
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {});
        }

        if (!isVisible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setIsActive(false);
                onClose();
            });
        }
    }, [isVisible, contentHeight]);

    if (!isActive) return null;

    const containerOffsetStyle = {
        transform: [
            {
                translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [contentHeight, 0],
                }),
            },
        ],
    };

    return (
        <View
            style={{
                position: 'absolute',
                bottom: 0,
                top: 0,
                right: 0,
                left: 0,
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                zIndex: 99,
            }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View
                    style={{
                        justifyContent: 'flex-end',
                        alignContent: 'flex-end',
                        flex: 1,
                    }}
                >
                    <Animated.View
                        style={[
                            styles.container,
                            { backgroundColor },
                            containerOffsetStyle,
                        ]}
                        onLayout={handleLayout}
                    >
                        {children}
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,

        paddingBottom: 40,

        // iOS shadow properties
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -3, // Negative value to create shadow on top
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        // Android elevation
        elevation: 5,
    },
});

export default SurveyPanel;
