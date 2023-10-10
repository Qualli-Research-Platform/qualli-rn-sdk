import React, { useState, useEffect } from 'react';
import { Animated, View, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SurveyBackdrop = (props: Props) => {
  const { isVisible, onClose, children } = props;

  const [overlayOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      Animated.timing(overlayOpacity, {
        toValue: 0.4,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isVisible, overlayOpacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />
      </Animated.View>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  overlayTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default SurveyBackdrop;
