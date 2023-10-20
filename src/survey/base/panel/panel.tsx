import React, { useState, useRef, useEffect } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Animated, StyleSheet, Dimensions } from 'react-native';

interface Props {
    isVisible: boolean;
    backgroundColor?: string;
    children: React.ReactNode;
    onDoneClosing: () => void;
}

const SurveyPanel = (props: Props) => {
    const { isVisible, children, backgroundColor, onDoneClosing } = props;

    const [contentHeight, setContentHeight] = useState(0);
    const slideAnim = useRef(
        new Animated.Value(Dimensions.get('screen').height),
    ).current;

    const handleLayout = (event: LayoutChangeEvent) => {
        let { height } = event.nativeEvent.layout;
        height = Math.ceil(height);

        if (contentHeight !== height && isVisible) {
            setContentHeight(height);
        }
    };

    useEffect(() => {
        if (contentHeight && isVisible) {
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {});
        }

        if (!isVisible) {
            Animated.timing(slideAnim, {
                toValue: contentHeight,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                onDoneClosing();
            });
        }
    }, [isVisible, contentHeight]);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [
                        {
                            translateY: slideAnim,
                        },
                    ],
                    backgroundColor,
                },
                ,
            ]}
            onLayout={handleLayout}
        >
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('screen').width,
        left: 0,
        right: 0,
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
