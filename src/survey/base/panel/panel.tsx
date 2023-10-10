import React, { useState, useRef, useEffect } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import {
  Animated,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  isVisible: boolean;
  backgroundColor?: string;
  children: React.ReactNode;
}

const SurveyPanel = (props: Props) => {
  const { isVisible, children, backgroundColor } = props;

  const [contentHeight, setContentHeight] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;

    if (contentHeight === 0) {
      setContentHeight(height);
      slideAnim.setValue(-height);
    }
  };

  useEffect(() => {
    if (contentHeight > 0) {
      Animated.timing(slideAnim, {
        toValue: isVisible ? 0 : -contentHeight,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isVisible, slideAnim, contentHeight]);

  return (
    <Animated.View
      onLayout={handleLayout}
      style={[styles.container, { bottom: slideAnim, backgroundColor }]}
    >
      <View>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 40,
  },
});

export default SurveyPanel;
