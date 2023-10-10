import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';

interface Props {
  numberOfSlides: number;
  currentSlideIndex: number;
  onClose: () => void;
}

const SurveyHeading = (props: Props) => {
  const { numberOfSlides, currentSlideIndex, onClose } = props;

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}></View>

      <TouchableOpacity
        style={styles.closeIcon}
        onPress={props.onClose}
        hitSlop={20}
      >
        <Image source={require('./../../../assets/icons/cross.png')} />
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
