import React, { useRef, useEffect } from 'react';
import { Animated, type ViewProps } from 'react-native';

interface DynamicHeightViewProps extends ViewProps {
    height: number;
    delay?: number;
    children: React.ReactNode;
}

const DynamicHeightView: React.FC<DynamicHeightViewProps> = ({
    height,
    delay,
    children,
    ...rest
}) => {
    const heightAnim = useRef(new Animated.Value(height)).current;

    useEffect(() => {
        if (height === undefined || height === null) {
            return;
        }

        Animated.timing(heightAnim, {
            toValue: height,
            duration: 250,
            delay: delay !== undefined ? delay : 300,
            useNativeDriver: false,
        }).start();
    }, [height]);

    return (
        <Animated.View
            {...rest}
            style={[
                rest.style,
                {
                    height: heightAnim,
                },
            ]}
        >
            {children}
        </Animated.View>
    );
};

export default DynamicHeightView;
